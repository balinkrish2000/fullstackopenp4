const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    if (blogs.length === 0) {
        return 0
    } else if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        return blogs.reduce(reducer, 0)
    }
}

const favouriteBlog = (blogs) => {
    const reducer = (firstItem, secondItem) => {
        return firstItem.likes >= secondItem.likes ? firstItem : secondItem
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, -Infinity)
}

const mostBlogs = (blogs) => {
    const blogAuthors = blogs.map(item => item.author)
    const blogAuthorsCount = lodash.countBy(blogAuthors)
    const maxAuthor = lodash.max(Object.keys(blogAuthorsCount), o => blogAuthorsCount[o])
    const maxCount = blogAuthorsCount[maxAuthor]
    return { 
        author: maxAuthor,
        blogs: maxCount
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}