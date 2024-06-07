import { ObjectId } from "mongodb";
import AppError from "../../utils/appError.js";
import catchAsyncErr from "../../utils/catchAsyncErr.js";

export const getAll = (Model) =>
  catchAsyncErr(async (_, res, next) => {
    const docs = await Model.find();
    const modelCollectionName = Model.collection.collectionName; // e.g users, posts, etc
    if (!docs || docs.length < 1) {
      res.status(200).json({
        success: "success",
        message: `No ${modelCollectionName} found!`,
      });
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
    let singularCollectionName;
    /** 
     Checking the following conditions:
     a) if the plural name of the collection ends with 'ses', then
     exclude the 'e' from its singular form, e.g 'addresses' will
     be 'address' instead of 'addresse'.
     b) if the plural ends with 'ies', replace the last 3 characters with
     'y', e.g 'replies' will be 'reply'
     c) else, only remove the plural 's' at the end 
     */
    if (modelCollectionName.endsWith("ses")) {
      singularCollectionName = modelCollectionName.slice(0, -2);
    } else if (modelCollectionName.endsWith("ies")) {
      singularCollectionName = modelCollectionName.replace("ies", "y");
    } else {
      singularCollectionName = modelCollectionName.slice(0, -1);
    }
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
    const modelCollectionName = Model.collection.collectionName;
    let singularCollectionName;
    /** 
     Checking the following conditions:
     a) if the plural name of the collection ends with 'ses', then
     exclude the 'e' from its singular form, e.g 'addresses' will
     be 'address' instead of 'addresse'.
     b) if the plural ends with 'ies', replace the last 3 characters with
     'y', e.g 'replies' will be 'reply'
     c) else, only remove the plural 's' at the end 
     */
    if (modelCollectionName.endsWith("ses")) {
      singularCollectionName = modelCollectionName.slice(0, -2);
    } else if (modelCollectionName.endsWith("ies")) {
      singularCollectionName = modelCollectionName.replace("ies", "y");
    } else {
      singularCollectionName = modelCollectionName.slice(0, -1);
    }
    const capitlaizedCollectionName = `${singularCollectionName // capitalized: having the 1st letter upper cased
      .slice(0, 1)
      .toUpperCase()}${singularCollectionName.slice(1)}`;
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
    res.status(201).json(responseObj);
  });

export const deleteOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    const modelCollectionName = Model.collection.collectionName;
    let singularCollectionName;
    /** 
     Checking the following conditions:
     a) if the plural name of the collection ends with 'ses', then
     exclude the 'e' from its singular form, e.g 'addresses' will
     be 'address' instead of 'addresse'.
     b) if the plural ends with 'ies', replace the last 3 characters with
     'y', e.g 'replies' will be 'reply'
     c) else, only remove the plural 's' at the end 
     */
    if (modelCollectionName.endsWith("ses")) {
      singularCollectionName = modelCollectionName.slice(0, -2);
    } else if (modelCollectionName.endsWith("ies")) {
      singularCollectionName = modelCollectionName.replace("ies", "y");
    } else {
      singularCollectionName = modelCollectionName.slice(0, -1);
    }
    const capitlaizedCollectionName = `${singularCollectionName // capitalized: having the 1st letter upper cased
      .slice(0, 1)
      .toUpperCase()}${singularCollectionName.slice(1)}`;

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
      message: `${capitlaizedCollectionName} has been deleted successfully`,
    };
    res.status(200).json(responseObj);
  });

export const updateOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    // Find the item
    const doc = await Model.findById(req.params.id);

    // Check if the document exists
    if (!doc) {
      return next(
        new AppError(
          `No ${modelCollectionName} found with the provided ID!`,
          404
        )
      );
    }

    // Parse the collection name
    const modelCollectionName = Model.collection.collectionName;
    let singularCollectionName;
    /** 
     Checking the following conditions:
     a) if the plural name of the collection ends with 'ses', then
     exclude the 'e' from its singular form, e.g 'addresses' will
     be 'address' instead of 'addresse'.
     b) if the plural ends with 'ies', replace the last 3 characters with
     'y', e.g 'replies' will be 'reply'
     c) else, only remove the plural 's' at the end 
     */
    if (modelCollectionName.endsWith("ses")) {
      singularCollectionName = modelCollectionName.slice(0, -2);
    } else if (modelCollectionName.endsWith("ies")) {
      singularCollectionName = modelCollectionName.replace("ies", "y");
    } else {
      singularCollectionName = modelCollectionName.slice(0, -1);
    }

    const capitlaizedCollectionName = `${singularCollectionName // capitalized: having the 1st letter upper cased
      .slice(0, 1)
      .toUpperCase()}${singularCollectionName.slice(1)}`;

    // Check if the user is authorized to make the update
    if (new ObjectId(req.user.id) !== doc.userID) {
      return next(
        new AppError(
          `You are not authorized to update this ${singularCollectionName}`,
          401
        )
      );
    }

    // Check if the password is among the fields to be updated, 
    // throw an error if so
    if (req.body.password) {
      return next(
        new AppError(
          `Changing password is not allowed through this endpoint!`,
          400
        )
      );
    }

    // Update the document
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const responseObj = {
      status: "success",
      message: `${capitlaizedCollectionName} has been updated successfully`,
    };
    responseObj[singularCollectionName] = updatedDoc;
    res.status(200).json(responseObj);
  });
