import CountUp from "react-countup";
import { Link } from 'react-router-dom';
const Esencias =()=>{
    return(
       <div className=" m-16 min-h-fit flex flex-col md:flex-row justify-center items-center py-8">
            <div className="text-white bg-black z-40 pr-40 pl-8 pt-8 pb-8 translate-x-12 text-start flex flex-col">
                <h1 className="font-regular uppercase text-5xl"> Top</h1>
                <p className="text-yellow-200 font-bold text-9xl">
                    <CountUp end={90} start = {0} duration={5}></CountUp>
                </p>
                <span className="font-regular uppercase text-5xl">
                    Mas Vendidas
                </span>
                <Link to="/" className="mt-8 uppercas tracking-widest relative group">Conoce nuestro Catalogo
                    <div className=" absolute w-full h-0.5 bg-white 
                    scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </Link>
            </div>
            <div className="">
                <img src="https://e1.pxfuel.com/desktop-wallpaper/441/861/desktop-wallpaper-different-perfumes-perfumes.jpg" alt="" />
            </div>
       </div> 
    )
}
export default Esencias;