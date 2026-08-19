#!/usr/bin/env python3
"""Sube en masa a Odoo las fotos de las esencias que ya están en src/services/esenciasBack.js.

Dos caminos, el mismo origen de datos:

  csv    Cruza el JSON con un export de productos de Odoo y escribe un CSV de
         dos columnas (id, image_1920) listo para «Importar» desde la interfaz.
         No toca Odoo: sólo lee el export y produce el archivo.

  subir  Hace el trabajo completo por XML-RPC: busca cada producto, descarga la
         foto y la escribe en image_1920. Sin --aplicar sólo simula y reporta.

Uso:
  python3 scripts/odoo_imagenes.py csv   --odoo ~/Downloads/Product.csv
  python3 scripts/odoo_imagenes.py subir                 # simulacro
  python3 scripts/odoo_imagenes.py subir --aplicar       # escribe de verdad

Credenciales para «subir» (variables de entorno, nunca en el repositorio):
  ODOO_URL=https://distribucionestimaran.odoo.com
  ODOO_DB=<base de datos>
  ODOO_USER=<correo del usuario>
  ODOO_API_KEY=<clave de API>
"""

import argparse
import base64
import csv
import json
import os
import re
import sys
import unicodedata
import urllib.request
import xmlrpc.client
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "src" / "services" / "esenciasBack.js"

# Las esencias sin foto propia apuntan todas a este marcador de posición.
PLACEHOLDER = "no-image"

AGENTE = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) TimaranWeb/1.0"


# --------------------------------------------------------------------------
# Lectura del catálogo
# --------------------------------------------------------------------------
def leer_esencias():
    """esenciasBack.js es JSON envuelto en JS: comentarios de línea y comas colgantes."""
    texto = FUENTE.read_text(encoding="utf-8")
    texto = texto[texto.index("[") :]
    texto = "\n".join(
        linea for linea in texto.splitlines() if not linea.strip().startswith("//")
    )
    texto = re.sub(r",(\s*[\]\}])", r"\1", texto)
    return json.loads(texto.strip().rstrip(";"))


def con_foto(esencias):
    return [e for e in esencias if e.get("picture") and PLACEHOLDER not in e["picture"]]


def normalizar(valor):
    """Clave de comparación: sin acentos, sin dobles espacios, en mayúsculas."""
    valor = unicodedata.normalize("NFKD", valor or "")
    valor = "".join(c for c in valor if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", valor).strip().upper()


def indice_por_nombre(esencias, campos):
    """{nombre normalizado: esencia}. Un nombre ambiguo se descarta para no adivinar."""
    indice, ambiguos = {}, set()
    for esencia in esencias:
        for campo in campos:
            clave = normalizar(esencia.get(campo))
            if not clave:
                continue
            if clave in indice and indice[clave] is not esencia:
                ambiguos.add(clave)
            indice.setdefault(clave, esencia)
    for clave in ambiguos:
        indice.pop(clave, None)
    return indice, ambiguos


# --------------------------------------------------------------------------
# Modo csv
# --------------------------------------------------------------------------
def modo_csv(args):
    esencias = con_foto(leer_esencias())
    indice, ambiguos = indice_por_nombre(esencias, args.campos)

    if not Path(args.odoo).is_file():
        sys.exit(
            f"No existe {args.odoo}.\n"
            "Ese archivo lo produce Odoo, no este script: Productos → seleccionar todos\n"
            "→ ⚙ Exportar → marcar «Deseo actualizar datos» → campo Nombre → Exportar.\n"
            "Luego se pasa aquí la ruta del CSV que quedó descargado.\n"
            "Si prefieres saltarte el export, usa «subir», que habla directo con Odoo."
        )

    with open(args.odoo, newline="", encoding="utf-8-sig") as f:
        muestra = f.read(4096)
        f.seek(0)
        try:
            dialecto = csv.Sniffer().sniff(muestra, delimiters=",;\t")
        except csv.Error:
            dialecto = csv.excel
        filas = list(csv.DictReader(f, dialect=dialecto))

    if not filas:
        sys.exit(f"El export {args.odoo} está vacío.")

    columnas = filas[0].keys()
    col_id = next((c for c in columnas if c.strip().lower() in ("id", "external id")), None)
    if not col_id:
        sys.exit(
            "El export no trae columna «id». Al exportar desde Odoo hay que marcar\n"
            "«Deseo actualizar datos» para que incluya el ID externo; sin él la\n"
            "importación crearía productos nuevos en vez de actualizar los existentes."
        )
    col_nombre = next((c for c in columnas if c.strip().lower() in ("name", "nombre")), None)
    if not col_nombre:
        sys.exit("El export no trae columna «name»/«nombre»; agrégala y vuelve a exportar.")

    emparejados, sin_foto = [], []
    for fila in filas:
        esencia = indice.get(normalizar(fila[col_nombre]))
        if esencia:
            emparejados.append((fila[col_id], esencia["picture"], fila[col_nombre]))
        else:
            sin_foto.append(fila[col_nombre])

    salida = Path(args.salida)
    with open(salida, "w", newline="", encoding="utf-8") as f:
        escritor = csv.writer(f)
        escritor.writerow(["id", "image_1920"])
        for id_externo, url, _ in emparejados:
            escritor.writerow([id_externo, url])

    usadas = {url for _, url, _ in emparejados}
    print(f"Productos en el export ......... {len(filas)}")
    print(f"Esencias con foto en el JSON ... {len(esencias)}")
    print(f"Emparejados .................... {len(emparejados)}  → {salida}")
    print(f"Productos sin foto ............. {len(sin_foto)}")
    print(f"Fotos que no encontraron dueño . {len(esencias) - len(usadas)}")
    if ambiguos:
        print(f"Nombres repetidos, omitidos .... {len(ambiguos)}: {', '.join(sorted(ambiguos))}")
    if sin_foto:
        reporte = salida.with_name(salida.stem + "-sin-foto.txt")
        reporte.write_text("\n".join(sin_foto), encoding="utf-8")
        print(f"Listado de los que quedaron sin foto → {reporte}")
    print(
        "\nEn Odoo: Productos → ⚙ Importar registros → subir el CSV → mapear\n"
        "«id» a External ID e «image_1920» a Imagen. Si son muchas, pártelo en\n"
        "bloques de ~100 filas: Odoo descarga cada URL y la petición puede expirar."
    )


# --------------------------------------------------------------------------
# Modo subir (XML-RPC)
# --------------------------------------------------------------------------
def conectar():
    faltantes = [v for v in ("ODOO_URL", "ODOO_DB", "ODOO_USER", "ODOO_API_KEY") if not os.environ.get(v)]
    if faltantes:
        sys.exit("Faltan variables de entorno: " + ", ".join(faltantes))
    url = os.environ["ODOO_URL"].rstrip("/")
    db, usuario, clave = os.environ["ODOO_DB"], os.environ["ODOO_USER"], os.environ["ODOO_API_KEY"]
    comun = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/common")
    uid = comun.authenticate(db, usuario, clave, {})
    if not uid:
        sys.exit("Odoo rechazó las credenciales. En Odoo Online hay que usar una clave de API, no la contraseña.")
    modelos = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/object", allow_none=True)
    return db, uid, clave, modelos


def descargar(url, intentos=3):
    ultimo = None
    for _ in range(intentos):
        try:
            pedido = urllib.request.Request(url, headers={"User-Agent": AGENTE})
            with urllib.request.urlopen(pedido, timeout=30) as resp:
                return resp.read()
        except Exception as error:  # red intermitente, 429, etc.
            ultimo = error
    raise ultimo


def modo_subir(args):
    esencias = con_foto(leer_esencias())
    if args.limite:
        esencias = esencias[: args.limite]
    db, uid, clave, modelos = conectar()

    def llamar(modelo, metodo, *parametros, **opciones):
        return modelos.execute_kw(db, uid, clave, modelo, metodo, list(parametros), opciones)

    # Un solo viaje: traigo nombre y referencia de todos los productos y cruzo aquí.
    productos = llamar(
        "product.template", "search_read", [], fields=["name", "default_code"]
    )
    por_nombre = {}
    for producto in productos:
        for valor in (producto["name"], producto.get("default_code")):
            clave_norm = normalizar(valor) if valor else ""
            if clave_norm:
                por_nombre.setdefault(clave_norm, []).append(producto["id"])

    tareas, sin_producto = [], []
    for esencia in esencias:
        ids = []
        for campo in args.campos:
            ids = por_nombre.get(normalizar(esencia.get(campo)), [])
            if ids:
                break
        if len(ids) == 1:
            tareas.append((ids[0], esencia))
        elif len(ids) > 1:
            sin_producto.append(f"{esencia['newName']} (coincide con {len(ids)} productos)")
        else:
            sin_producto.append(f"{esencia['newName']} / {esencia['name'].strip()}")

    ya_tienen = 0
    try:
        ya_tienen = llamar(
            "product.template", "search_count",
            [["id", "in", [t[0] for t in tareas]], ["image_1920", "!=", False]],
        )
    except Exception:
        pass  # no todas las versiones aceptan filtrar por un campo binario

    print(f"Esencias con foto .............. {len(esencias)}")
    print(f"Productos en Odoo .............. {len(productos)}")
    print(f"Emparejados .................... {len(tareas)}")
    print(f"Sin producto en Odoo ........... {len(sin_producto)}")
    if ya_tienen:
        print(f"De los emparejados, ya con foto  {ya_tienen}  (se van a reemplazar)")
    if sin_producto:
        reporte = RAIZ / "esencias-sin-producto.txt"
        reporte.write_text("\n".join(sin_producto), encoding="utf-8")
        print(f"Listado de los no emparejados → {reporte}")

    if not args.aplicar:
        print("\nSimulacro: no se escribió nada. Repite con --aplicar para subirlas.")
        return

    subidas, fallidas = 0, []
    for numero, (id_producto, esencia) in enumerate(tareas, 1):
        try:
            imagen = base64.b64encode(descargar(esencia["picture"])).decode()
            llamar("product.template", "write", [id_producto], {"image_1920": imagen})
            subidas += 1
        except Exception as error:
            fallidas.append(f"{esencia['newName']}: {error}")
        if numero % 25 == 0 or numero == len(tareas):
            print(f"  {numero}/{len(tareas)} — {subidas} subidas, {len(fallidas)} con error")

    print(f"\nListo: {subidas} imágenes subidas.")
    if fallidas:
        reporte = RAIZ / "esencias-fallidas.txt"
        reporte.write_text("\n".join(fallidas), encoding="utf-8")
        print(f"{len(fallidas)} fallaron → {reporte} (se puede repetir el comando; sólo reintenta lo que falte si borras las demás)")


# --------------------------------------------------------------------------
def main():
    padre = argparse.ArgumentParser(add_help=False)
    padre.add_argument(
        "--campo",
        dest="campos",
        default="newName,name",
        help="campos del JSON con que buscar el producto, en orden (por omisión newName,name)",
    )

    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="modo", required=True)

    p_csv = sub.add_parser("csv", parents=[padre], help="genera el CSV para importar desde la interfaz")
    p_csv.add_argument("--odoo", required=True, help="CSV exportado de Odoo (con la columna id)")
    p_csv.add_argument("--salida", default="esencias-imagenes.csv")
    p_csv.set_defaults(func=modo_csv)

    p_subir = sub.add_parser("subir", parents=[padre], help="sube las imágenes por XML-RPC")
    p_subir.add_argument("--aplicar", action="store_true", help="escribe en Odoo (sin esto sólo simula)")
    p_subir.add_argument("--limite", type=int, help="procesar sólo las primeras N esencias")
    p_subir.set_defaults(func=modo_subir)

    args = parser.parse_args()
    args.campos = [c.strip() for c in args.campos.split(",") if c.strip()]
    args.func(args)


if __name__ == "__main__":
    main()
