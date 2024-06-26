import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children, ...props }) => {
    return (
        <>
            <div className='flex flex-auto h-full'>
            {props.Gerente? <><Sidebar /></>:<></>}
                
                <div className='grow'>
                    <Navbar accountshow={props.accountshow} account={props.account} />
                    <div className='m-5'>{children}</div>
                </div>
            </div>
        </>
    )
}

export default Layout
