const knex = require("../db/connection");

const tableName="movies";

function read(movieId){
    return knex(tableName)
        .select()
        .where({movie_id:movieId})
        .first();
}

function list(is_showing) {
    if (is_showing!==undefined){
        console.log("is_showing: ",is_showing);
        return knex("movies as m")
            .join("movies_theaters as mt","m.movie_id","mt.movie_id")
            .select("m.*")
            .where ({"mt.is_showing":true})
            .groupBy("m.movie_id")
            .orderBy("m.movie_id");
    }
    else{
        return knex(tableName).select();
    }
}

module.exports={
    read,
    list,
}