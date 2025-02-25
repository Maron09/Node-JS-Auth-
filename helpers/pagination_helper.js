const paginationResults = (req, totalItems) => {
    const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`

    let page = Math.max(parseInt(req.query.page) || 1, 1)
    let limit = Math.max(parseInt(req.query.limit) || 5, 1)
    let skip = (page - 1) * limit
    let totalPages = Math.ceil(totalItems / limit)



    const generatePageUrl = (newPage) => {
        const queryParams = new URLSearchParams(req.query)
        queryParams.set("page", newPage)
        return `${baseUrl}?${queryParams.toString()}`
    }


    return {
        page,
        limit,
        skip,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPageUrl: page < totalPages ? generatePageUrl(page + 1) : null,
        prevPageUrl: page > 1 ? generatePageUrl(page - 1) : null
    }

}


export default paginationResults