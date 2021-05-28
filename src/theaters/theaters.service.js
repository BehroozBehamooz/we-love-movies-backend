const { join } = require("../db/connection");
const knex = require("../db/connection");
const reducedProperties=require("../utils/reduce-properties");
//const reducedProperties=""

const tableName="theaters";

const addCategoty=reducedProperties("theater_id",{
    "movie_id": ["movies",null,"movie_id"],
    "title": ["movies",null,"title"],
    "runtime_in_minutes": ["movies",null,"runtime_in_minutes"],
    "rating": ["movies",null,"rating"],
    "description": ["movies",null,"description"],
    "image_url": ["movies",null,"image_url"],
    "created_at": ["movies",null,"created_at"],
    "updated_at": ["movies",null,"updated_at"],
    "is_showing": ["movies",null,"is_showing"],
    //"theater_id": ["movies",null,"theater_id"]
  })

function list(movieId=0){
    if (movieId){
        return knex("theaters as t")
                .join("movies_theaters as mt","t.theater_id","mt.theater_id")
                //.join("movies as m","m.movie_id","mt.movie_id")
                .select("t.*", "mt.is_showing", "mt.movie_id")
                .where({"mt.movie_id":movieId});
    }else{
        return knex("theaters as t")
            .join("movies_theaters as mt","mt.theater_id","t.theater_id")
            .join("movies as m","m.movie_id","mt.movie_id")
            .select()
            .then(addCategoty);
    }
}

module.exports={
    list,
}