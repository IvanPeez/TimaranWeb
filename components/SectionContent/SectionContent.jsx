import React, { forwardRef } from 'react';
const SectionContent = forwardRef(({ children, className = '', style = {} }, ref) => {
    return (
        <section ref={ref} className={`w-full  ${className}`} style={style}>
            {children}
        </section>
    );
});

export default SectionContent;