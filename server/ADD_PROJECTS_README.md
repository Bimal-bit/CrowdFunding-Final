# Adding More Verified Projects

This guide explains how to add more verified projects to your FundRise platform.

## 📋 What's Included

The `add-more-projects.js` script adds **10 diverse verified projects** across different categories:

1. **Smart Agriculture IoT System** (Technology) - ₹5,00,000 goal
2. **Eco-Friendly Bamboo Furniture** (Design) - ₹3,00,000 goal
3. **Community Learning Center** (Education) - ₹7,50,000 goal
4. **Organic Urban Rooftop Farm** (Environment) - ₹4,00,000 goal
5. **Mental Health Support App** (Health) - ₹6,00,000 goal
6. **Indie Documentary** (Film) - ₹3,50,000 goal
7. **Artisan Coffee Roastery** (Food) - ₹4,50,000 goal
8. **Renewable Energy for Schools** (Environment) - ₹10,00,000 goal
9. **Adaptive Gaming Controllers** (Technology) - ₹5,50,000 goal
10. **Traditional Craft Revival** (Arts) - ₹4,00,000 goal

## ✨ Features

Each project includes:
- ✅ Verified status
- 📸 High-quality images from Unsplash
- 💰 Realistic funding goals and current raised amounts
- 👥 Backer counts
- 🎁 Multiple reward tiers (3 per project)
- 📝 Detailed descriptions
- ⏰ Active campaign status with days remaining
- 🌟 Some projects marked as "featured"

## 🚀 How to Use

### Prerequisites
1. Make sure your MongoDB database is running
2. Ensure you have at least one admin user in the database
3. Your `.env` file should be properly configured with `MONGODB_URI`

### Steps

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Run the script:**
   ```bash
   node add-more-projects.js
   ```

3. **Expected Output:**
   ```
   🔌 Connecting to MongoDB...
   ✅ Connected to MongoDB
   👤 Using admin user: admin@fundrise.com
   
   📦 Adding 10 new projects...
   
   ✅ Successfully added 10 projects!
   
   📊 Project Summary:
   1. Smart Agriculture IoT System
      Category: Technology
      Goal: ₹5,00,000
      Raised: ₹2,85,000 (57%)
      Backers: 142
      Featured: Yes
   ...
   ```

## 🔧 Customization

### Adding Your Own Projects

Edit the `newProjects` array in `add-more-projects.js`:

```javascript
{
  title: "Your Project Title",
  description: "Short description (1-2 sentences)",
  longDescription: "Detailed description with multiple paragraphs",
  category: "Technology", // Technology, Design, Education, Health, etc.
  image: "https://your-image-url.com/image.jpg",
  goal: 500000, // Goal amount in rupees
  raised: 250000, // Current raised amount
  backers: 100, // Number of backers
  daysLeft: 30, // Days remaining in campaign
  status: "active",
  verified: true,
  featured: false, // Set to true for featured projects
  rewards: [
    {
      title: "Reward Title",
      description: "What backers get",
      amount: 1000, // Minimum pledge amount
      delivery: "Month Year",
      backers: 50 // Number who selected this reward
    }
    // Add more reward tiers...
  ]
}
```

### Categories Available
- Technology
- Design
- Education
- Health
- Environment
- Film
- Food
- Arts
- Music
- Games
- Fashion
- Publishing

## 📝 Notes

- All projects are automatically assigned to the first admin user found in the database
- End dates are calculated automatically based on `daysLeft`
- All projects are marked as verified and active
- Images use Unsplash URLs - replace with your own if needed
- Raised amounts are set to realistic partial funding (40-70% of goal)

## 🔄 Running Multiple Times

The script can be run multiple times, but it will create duplicate projects. If you want to avoid duplicates:

1. Clear existing projects first (use with caution):
   ```javascript
   await Project.deleteMany({ verified: true });
   ```

2. Or modify the script to check for existing projects before inserting

## 🐛 Troubleshooting

**Error: "No admin user found"**
- Solution: Create an admin user first by registering and updating the user role in the database

**Error: "Connection refused"**
- Solution: Make sure MongoDB is running and the connection string in `.env` is correct

**Error: "Duplicate key error"**
- Solution: The script is trying to insert projects that already exist. Clear the database or modify project titles

## 💡 Tips

- Run this script after initial setup to populate your platform with diverse projects
- Adjust the `raised` and `backers` values to show different funding progress
- Set some projects as `featured: true` to highlight them on the homepage
- Vary the `daysLeft` to create urgency for different campaigns

## 🎯 Next Steps

After adding projects:
1. Visit your frontend to see the new projects
2. Test the payment flow with different reward tiers
3. Customize project images and descriptions as needed
4. Add more projects by modifying the script and running again

---

**Happy Crowdfunding! 🚀**
