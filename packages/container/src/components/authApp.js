import { mount } from 'auth/AuthApp'
import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

export default ({onSignIn}) => {
    const ref = useRef(null)
    const history = useHistory()

    useEffect(() => {
        const {onParentNavigate} = mount(ref.current, {
            initialPath: history.location.pathname,
            onNavigate: ({ pathname: nextPathname }) => {
                //nextpathname is when use do some action and req for new url
                const {pathname} = history.location; // this is current path in browser
                if (pathname !== nextPathname) {
                    history.push(nextPathname)
                }
            },
            onSignIn: () => {
                //need to call this func when user sign in
                console.log('User sign in')
                onSignIn()
            }
        })

        if(onParentNavigate) {
            history.listen(onParentNavigate)
        }
    }, [])

    return <div ref={ref}></div>
}