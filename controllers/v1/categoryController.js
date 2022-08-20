const { categoryModel } = require("../../database/models")
const { apiResponse, responseCodes } = require("../../utility/commonUtility")

exports.createCategory = async (req, res) => {
    try {
        const { title, description } = req.body
        const category = new categoryModel({
            title,
            description,
            author: req.authorized
        })
        await category.save()
        return apiResponse(res, responseCodes.CREATED_OK, 'Category created successfully.')
    } catch(e) {
        return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
    }
}

exports.listCategory = async (req, res) => {
    try {
      let { limit, skip } = req.params;
      if (!limit) {
        limit = 10;
      }
      if (!skip) {
        skip = 0;
      }
      const posts = await categoryModel
        .find(
          {},
        )
        .populate('author', 'first_name last_name')
        .populate('posts', 'title description')
        .limit(limit)
        .skip(skip);
      return apiResponse(res, responseCodes.SUCCESS, null, {
        posts
      })
    } catch (e) {
      return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
    }
  };