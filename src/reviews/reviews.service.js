const knex=require("../db/connection");
const mapProperties=require("../utils/map-properties")

const tableName="reviews";

function read(reviewId){
    return knex(tableName)
        .select()
        .where({review_id:reviewId});
}

const addCategoty =mapProperties({
    //critic_id:["critic","critic_id"],
    preferred_name:["critic","preferred_name"],
    surname:["critic","surname"],
    organization_name:["critic","organization_name"],
    //created_at:["critic","created_at"],
    //updated_at:["critic","updated_at"]
});

function update(reviewId,change){
    return knex(tableName)
        .update(change)
        .where({review_id:reviewId})
        .then(()=>knex("reviews as r")
            .join("critics as c","c.critic_id","r.critic_id")
            .select()
            .where({review_id:reviewId})
            .first())
        .then(addCategoty);
}

function destroy(reviewId){
    return knex(tableName)
        .where({review_id:reviewId})
        .delete();
}

function list(movieId=0){
    if (movieId){
        return knex("reviews as r")
            .join("critics as c","c.critic_id","r.critic_id")
            .select("r.*","c.*")
            .where({"r.movie_id":movieId})
            .then(reviews=>reviews.map(addCategoty));
    }
    else{
        return knex(tableName).select();
    }
}
module.exports={
    read,
    update,
    delete:destroy,
    list,
}