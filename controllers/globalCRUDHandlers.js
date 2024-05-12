import AppError from "../utils/appError.js";
import catchAsyncErr from "../utils/catchAsyncErr.js";

export const getAll = (Model) =>
  catchAsyncErr(async (_, res, next) => {
    const docs = await Model.find();
    const modelCollectionName = Model.collection.collectionName; // e.g users, posts, etc
    if (!docs || docs.length < 1) {
      return next(new AppError(`No ${modelCollectionName} found!`, 404));
    }
    const responseObj = {
      status: "success",
      results: docs.length,
    };
    responseObj[modelCollectionName] = docs;
    res.status(200).json(responseObj);
  });

export const getOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    const modelCollectionName = Model.collection.collectionName;
    const singularCollectionName = Model.collection.collectionName.slice(0, -1);

    if (!doc) {
      return next(
        new AppError(
          `No ${modelCollectionName} found with the provided ID!`,
          404
        )
      );
    }

    const responseObj = {
      status: "success",
    };
    responseObj[singularCollectionName] = doc;
    res.status(200).json(responseObj);
  });

export const createOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const data = req.body;
    const doc = await Model.create(data);
    const singularCollectionName = Model.collection.collectionName.slice(0, -1);
    const capitlaizedCollectionName = `${singularCollectionName
      .slice(0, 1)
      .toUpperCase()}${singularCollectionName.slice(1)}`; // capitalized: having the 1st letter upper cased

    if (!doc) {
      return next(
        AppError(
          `Error creating a new ${singularCollectionName}! Please try again.`,
          500
        )
      );
    }
    const responseObj = {
      status: "success",
      message: `${capitlaizedCollectionName} created successfully`,
    };
    responseObj[singularCollectionName] = doc;
    res.status(201).json({});
  });

export const deleteOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    const modelCollectionName = Model.collection.collectionName;

    if (!doc) {
      return next(
        new AppError(
          `No ${modelCollectionName} found with the provided ID!`,
          404
        )
      );
    }

    const responseObj = {
      status: "success",
      message: "Your account has been deleted successfully",
    };
    res.status(200).json(responseObj);
  });

export const updateOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const modelCollectionName = Model.collection.collectionName;
    const singularCollectionName = Model.collection.collectionName.slice(0, -1);

    if (!doc) {
      return next(
        new AppError(
          `No ${modelCollectionName} found with the provided ID!`,
          404
        )
      );
    }

    if (req.body.password) {
      return next(
        new AppError(
          `Changing password is not allowed through this endpoint!`,
          400
        )
      );
    }

    const responseObj = {
      status: "success",
      message: "Your account has been updated successfully",
    };
    responseObj[singularCollectionName] = doc;
    res.status(200).json(responseObj);
  });
