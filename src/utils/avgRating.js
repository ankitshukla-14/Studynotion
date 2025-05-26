export default function getAvgRating(ratingArr) {
    if(ratingArr?.length === 0) {
        return 0
    }
    const totalRatings = ratingArr?.reduce((acc, curr) => {
        acc += curr.rating 
        return acc
    }, 0)

    const multiplier = Math.pow(10, 1)
    const avgRating = Math.round((totalRatings / ratingArr.length) * multiplier) / multiplier
    return avgRating
}