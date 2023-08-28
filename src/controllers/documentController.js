import { StatusCodes } from "http-status-codes";
import Document from "../models/DocumentModel.js";
import { validationResult } from "express-validator";
import errorHandler from "../middleware/validationErrorHandler.js";

// Create Document Api

export const createDocument = async(req,res)=>{
    try {
      const errors = validationResult(req);
      const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

    const document = new Document(req.body)
    const savedDocument = await document.save()

    return res.status(StatusCodes.CREATED).json({success:true, message:"The document has been created.", data:savedDocument} )

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"There was an error while creating the document.", error: error.message})
    }
}



// Edit Document Api

export const updateDocument = async (req, res) => {
    try {
      const errors = validationResult(req);
      const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

      const documentId = req.params.id; 
      
      const existingDocument = await Document.findById(documentId);
      if (!existingDocument) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: "The document could not be found." });
      }
  
      const updatedDocumentData = req.body;
  
      Object.assign(existingDocument, updatedDocumentData);
  
      const savedDocument = await existingDocument.save();
  
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "The document has been updated.",
        data: savedDocument,
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "There was an error while updating the document.",
        error: error.message,
      });
    }
  };