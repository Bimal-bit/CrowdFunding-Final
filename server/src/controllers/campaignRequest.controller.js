import CampaignRequest from '../models/CampaignRequest.model.js';
import Project from '../models/Project.model.js';
import { generateCertificate } from '../utils/generateCertificate.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Submit a new campaign request (any authenticated user)
export const submitCampaignRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      creator: req.user._id,
      status: 'pending'
    };

    const campaignRequest = await CampaignRequest.create(requestData);
    
    res.status(201).json({ 
      success: true, 
      message: 'Campaign request submitted successfully. It will be reviewed by an admin.',
      data: campaignRequest 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all campaign requests for the logged-in user
export const getMyCampaignRequests = async (req, res) => {
  try {
    const requests = await CampaignRequest.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');
    
    res.status(200).json({ 
      success: true, 
      count: requests.length, 
      data: requests 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pending campaign requests (admin only)
export const getAllCampaignRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const requests = await CampaignRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('creator', 'name email avatar')
      .populate('reviewedBy', 'name email');
    
    res.status(200).json({ 
      success: true, 
      count: requests.length, 
      data: requests 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single campaign request by ID
export const getCampaignRequest = async (req, res) => {
  try {
    const request = await CampaignRequest.findById(req.params.id)
      .populate('creator', 'name email avatar')
      .populate('reviewedBy', 'name email');
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Campaign request not found' });
    }

    // Check if user is the creator or an admin
    if (request.creator._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a campaign request and create a project (admin only)
export const approveCampaignRequest = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const campaignRequest = await CampaignRequest.findById(req.params.id).populate('creator', 'name email');
    
    if (!campaignRequest) {
      return res.status(404).json({ success: false, message: 'Campaign request not found' });
    }

    if (campaignRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Campaign request has already been ${campaignRequest.status}` 
      });
    }

    // Create a new project from the campaign request
    const projectData = {
      title: campaignRequest.title,
      description: campaignRequest.description,
      longDescription: campaignRequest.longDescription,
      category: campaignRequest.category,
      image: campaignRequest.image,
      goal: campaignRequest.goal,
      daysLeft: campaignRequest.daysLeft,
      featured: campaignRequest.featured,
      creator: campaignRequest.creator._id,
      rewards: campaignRequest.rewards,
      status: 'active',
      endDate: new Date(Date.now() + campaignRequest.daysLeft * 24 * 60 * 60 * 1000)
    };

    const project = await Project.create(projectData);

    // Generate certificate for the campaign creator
    console.log('📜 Generating certificate for campaign approval...');
    const certificateUrl = await generateCertificate(campaignRequest, campaignRequest.creator);
    console.log('✅ Certificate generated:', certificateUrl);

    // Update campaign request status
    campaignRequest.status = 'approved';
    campaignRequest.adminNotes = adminNotes;
    campaignRequest.reviewedBy = req.user._id;
    campaignRequest.reviewedAt = new Date();
    campaignRequest.certificateUrl = certificateUrl;
    campaignRequest.updatedAt = new Date();
    await campaignRequest.save();

    // Generate download URL for certificate
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const certificateDownloadUrl = `${backendUrl}/api/campaign-requests/certificate/${campaignRequest._id}`;

    res.status(200).json({ 
      success: true, 
      message: 'Campaign request approved, project created, and certificate generated successfully!',
      data: { 
        campaignRequest, 
        project,
        certificateUrl,
        certificateDownloadUrl
      }
    });
  } catch (error) {
    console.error('Error approving campaign request:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a campaign request (admin only)
export const rejectCampaignRequest = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const campaignRequest = await CampaignRequest.findById(req.params.id);
    
    if (!campaignRequest) {
      return res.status(404).json({ success: false, message: 'Campaign request not found' });
    }

    if (campaignRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Campaign request has already been ${campaignRequest.status}` 
      });
    }

    campaignRequest.status = 'rejected';
    campaignRequest.adminNotes = adminNotes || 'Campaign request did not meet our guidelines';
    campaignRequest.reviewedBy = req.user._id;
    campaignRequest.reviewedAt = new Date();
    campaignRequest.updatedAt = new Date();
    await campaignRequest.save();

    res.status(200).json({ 
      success: true, 
      message: 'Campaign request rejected',
      data: campaignRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a campaign request (creator can delete if pending, admin can delete any)
export const deleteCampaignRequest = async (req, res) => {
  try {
    const campaignRequest = await CampaignRequest.findById(req.params.id);
    
    if (!campaignRequest) {
      return res.status(404).json({ success: false, message: 'Campaign request not found' });
    }

    // Check permissions
    const isCreator = campaignRequest.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this request' });
    }

    if (isCreator && campaignRequest.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only delete pending requests' 
      });
    }

    await CampaignRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: 'Campaign request deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get certificate for approved campaign request
export const getCertificate = async (req, res) => {
  try {
    const campaignRequest = await CampaignRequest.findById(req.params.id)
      .populate('creator', 'name email');

    if (!campaignRequest) {
      return res.status(404).json({ success: false, message: 'Campaign request not found' });
    }

    if (campaignRequest.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate is only available for approved campaigns' 
      });
    }

    if (!campaignRequest.certificateUrl) {
      return res.status(404).json({ success: false, message: 'Certificate not generated yet' });
    }

    // Check if user is the creator or an admin
    if (campaignRequest.creator._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this certificate' });
    }

    const certificatePath = path.join(__dirname, '../../', campaignRequest.certificateUrl);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${campaignRequest.title.replace(/\s+/g, '_')}.pdf"`);
    
    res.download(certificatePath, `FundRise_Certificate_${campaignRequest.creator.name.replace(/\s+/g, '_')}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading certificate:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Error downloading certificate' });
        }
      }
    });
  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
