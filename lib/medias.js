import { useState, useContext, useEffect } from 'react'

const axios = require('axios');
const MediaContext = React.createContext()

export const MediaProvider = ({ children }) => {
    const [mediaData, setMediaData] = useState([])

    let values = { mediaData, setMediaData }
    return <MediaContext.Provider value={values}>{children}</MediaContext.Provider>
}


export const useMedia = () => {
    return useContext(MediaContext)
}