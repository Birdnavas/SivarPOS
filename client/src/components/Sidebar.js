import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Cookies from "js-cookie";

import { BsArrowLeftCircle } from 'react-icons/bs'
import { AiFillPieChart } from 'react-icons/ai'
import { FcShop } from 'react-icons/fc'
import { FcInTransit } from 'react-icons/fc'
import { FaUsers } from 'react-icons/fa'
import { FcViewDetails } from 'react-icons/fc'
import Logo from '../assets/images/Happylog.svg'
import HamburgerButton from './HamburgerMenuButton/HamburgerButton'
import { useGlobalState } from './GlobalState.jsx';


const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()
  const [myList, setMyList] = useState([]);
  const [prods, setProds] = useState(0);

  // useEffect(() => {
  //   const cookieValue = Cookies.get("myList");
  //   const parsedList = cookieValue ? JSON.parse(cookieValue) : [];
  //   setMyList(parsedList);
  //   setProds(myList.length);
  // }, []);

  const {globalState, setGlobalState} = useGlobalState();

  const Menus = [
    { title: 'Caja', count: <span className='bg-gray-500 text-white font-bold py-1 px-3 rounded-full'>{globalState}</span>, path: '/', src: <FcInTransit /> },
    { title: 'Tienda', path: '/tienda', src: <FcShop /> },
    { title: 'Inventario', path: '/productos', src: <FcViewDetails /> },
    { title: 'Panel', path: '/control', src: <AiFillPieChart />, gap: 'true' },
    { title: 'Admin', path: '/users', src: <FaUsers /> }
  ]

  return (
    <>
      <div
        className={`${
          open ? 'w-45' : 'w-fit'
        } hidden sm:block fixed h-screen duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 p-4 dark:bg-slate-800`}
      >
        <BsArrowLeftCircle
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
        <Link>
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src={Logo} alt='' className='pl-2' />
            
          </div>
        </Link>

        <ul className='pt-6'>
          {Menus.map((menu, index) => (
            <Link to={menu.path} key={index}>
              <li
                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${menu.gap ? 'mt-9' : 'mt-2'} ${
                  location.pathname === menu.path &&
                  'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span className='text-2xl'>{menu.src}</span>
                <span
                  className={`${
                    !open && 'hidden'
                  } origin-left duration-300 hover:block`}
                >
                  {menu.title}
                </span>
                {open ? menu.count: null}
                
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link
              to={menu.path}
              key={index}
              onClick={() => setMobileMenu(false)}
            >
              <span
                className={` ${
                  location.pathname === menu.path &&
                  'bg-gray-200 dark:bg-gray-700'
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar
