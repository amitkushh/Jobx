import Company from "../models/company.models.js";

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "you can't register same company",
      });
    }

    const company = await Company.create({
      name,
      userId: req.id,
    });

    await company.save();

    return res.status(201).json({
      success: true,
      message: "Company created Successfully",
      company,
    });
  } catch (error) {
    console.log("Error in registering company", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged userId

    const companies = await Company.find({
      userId,
    });

    if (!companies) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log("Error in finding company", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.log("Error in finding company by id", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const file = req.file; //cloudnary

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company information updated Successfully",
      company,
    });
  } catch (error) {
    console.log("Error in updating company", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
