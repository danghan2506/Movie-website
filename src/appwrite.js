import { Client, Databases, ID, Query } from "appwrite"

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID
const COLLECTIONS_ID = import.meta.env.VITE_COLLECTIONS_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID)
const database = new Databases(client)
export const updateSearchCount = async(searchTerm, movie) => {
    // 1.Use Appwrite API to check if the searchTerm exist in the db
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTIONS_ID, [
            Query.equal('searchTerm', searchTerm)
        ])
        // 2.If it does, increase the count
        if(result.documents.length > 0){
            const doc = result.documents[0]
            await database.updateDocument(DATABASE_ID, COLLECTIONS_ID, doc.$id, {
                count: doc.count + 1
            })
        }
        // 3.If no, set the count as 1
        else{
            await database.createDocument(DATABASE_ID, COLLECTIONS_ID, ID.unique(), {
                searchTerm, 
                count: 1,
                movie_id: movie.id,
                poster_url : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    }
    catch{

    }
    
    
}

export const getTrendingMovies = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTIONS_ID, [
        Query.limit(5),
        Query.orderDesc("count")
        ])
        return result.documents
    }
    
    catch(err){
        console.error(err)
    }
}