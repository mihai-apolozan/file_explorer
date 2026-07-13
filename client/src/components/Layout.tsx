import type { ReactNode } from 'react'
import '../style/Layout.css'

interface Props{
    sidebar: ReactNode;
    children: ReactNode;
}

export function Layout( { sidebar, children }: Props) {
    return (
        <div className = 'container'>
            <div className='left'>
                {sidebar}
            </div>
            <div className='right'>
                {children}
            </div>
        </div>
    )
}