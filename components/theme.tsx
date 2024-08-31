'use client'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export  function Theme({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false)
    const {setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) return

    const toggleTheme = () => {
        if (resolvedTheme === 'dark'){
            setTheme('light')
        } else if (resolvedTheme === 'light'){
            setTheme('dark')
        }
    }
    const btn_style = `inline align-middle p-2 lg:p-0 lg:border-none rounded-xl border ${className ? className : 'text-slate-200'}`
    const btn_size = 'w-5 h-5'

    return (
        <button 
            type="button"
            onClick={toggleTheme}
            className={btn_style}    
        >
            {resolvedTheme === 'dark' ? 
            (<Sun className={btn_size} aria-label='the sun'/>) : 
            (<Moon className={btn_size} aria-label='the moon'/>)}
        </button>
    )
    
}

