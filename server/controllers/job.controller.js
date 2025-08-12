import Job from "../models/job.models.js";

//For Admin
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      exprience,
      location,
      jobType,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !exprience ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Someting is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      exprienceLevel: exprience,
      location,
      jobType,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log("Error in posting jobs", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//For User
export const getAllJobs = async (req, res) => {
  try {
    //Filtering
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("Error in fatching all jobs", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//For User
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({
        path: "Company",
      })
      .sort({ createdAt: -1 });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error in fatching job by id", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//using populate you can access all information about the company
//For Admin:= How many jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("Error in fetching jobs by admin", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
