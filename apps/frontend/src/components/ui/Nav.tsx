

// export default function Nav() {
//   return (
//     <nav className="flex justify-start items-center">
//         <ul>
//             <li>KELLY-BESONG.DEV</li>
//         </ul>
//     </nav>
//   )
// }

import { useState } from 'react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto  h-20 flex justify-between items-center">
        
        {/* LOGO: Your Name */}
        <div className="text-xl font-black tracking-tighter text-black">
          KELLY-BESONG<span className="text-blue-600">.DEV</span>
        </div>

        {/* DESKTOP LINKS */}
        {/* <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li><a href="#work" className="hover:text-black transition-colors">Work</a></li>
          <li><a href="#about" className="hover:text-black transition-colors">About</a></li>
          <li><a href="#services" className="hover:text-black transition-colors">Services</a></li>
          <li>
            <a href="#contact" className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-sm">
              Let's Talk
            </a>
          </li>
        </ul> */}

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-black p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <a href="#work" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>Work</a>
          <a href="#about" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>About</a>
          <a href="#services" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#contact" className="text-lg font-semibold text-blue-600" onClick={() => setIsOpen(false)}>Contact Me</a>
        </div>
      )}
    </nav>
  );
}
