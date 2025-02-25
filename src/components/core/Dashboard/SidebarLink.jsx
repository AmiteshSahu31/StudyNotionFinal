import React from 'react'
import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

function SidebarLink({link,iconName}) {
    
    const Icon= Icons[iconName];
    const location= useLocation();
 //   const dispatch= useDispatch();

    const matchRoute= (route) => {
        return matchPath({path: route},location.pathname);
    }


    return (
           <NavLink to={link.path}
           className={`${matchRoute(link.path) ? "bg-yellow-800" : "bg-opacity-0" } relative px-8 py-2 text-sm font-medium `}>

            <span className={`absolute top-0 left-0 bg-yellow-50 h-full w-[0.15rem]
                 ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}> </span>

            <div className='flex items-center mx-auto gap-x-2 text-white'>
                <Icon className="text-lg"/> 
                 <span>{link.name}</span>
                
            </div>    

           </NavLink>
    )
}

export default SidebarLink
