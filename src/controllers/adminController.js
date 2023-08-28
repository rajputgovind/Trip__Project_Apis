import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";
import Sib from "sib-api-v3-sdk";


export const approvedOrganizer = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Not found" })
    }

    if (req.body.status === true) {
      const checkOrganizer = await Role.findById(user.role);
      if (checkOrganizer && checkOrganizer.roleName === "Organizer") {
        // console.log("organizer registration")
        user.isOrganizer = req.body.status

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
          email: "govindjadam5@gmail.com",
          name: `Hii govindjadam5@gmail.com`,
        };

        const receivers = [
          {
            email: user.email,
          },
        ];

        let emailResult = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: "Organizer Approval Notification",
          textContent: "Hello Organizer,\n\nCongratulations! Your request to become an organizer has been approved.",
          htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Organizer Approval Notification</h2>
          <p>Hello Organizer,</p>
          <p>Congratulations! Your request to become an organizer has been approved.</p>
          <p>Organizer Information:</p>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Role:</strong> ${checkOrganizer.roleName}</li>
          </ul>
          <p>Thank you for being a part of our team.</p>
          <p>You can access your organizer dashboard <a href="https://trip-planning-app.vercel.app/admin/login">here</a>.</p>
        </div>
      `,
          params: {
            role: "Frontend",
          },
        });


        await user.save()
        return res.status(StatusCodes.OK).json({ success: true, message: "You have been approved by the admin to serve as an organizer.", data: user })
      }
    }else{
      const checkOrganizer = await Role.findById(user.role);
      if (checkOrganizer && checkOrganizer.roleName === "Organizer") {
        // console.log("organizer registration")
        user.isOrganizer = req.body.status

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
          email: "govindjadam5@gmail.com",
          name: `Hii govindjadam5@gmail.com`,
        };

        const receivers = [
          {
            email: user.email,
          },
        ];

        let emailResult = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: "Organizer Application Status",
          textContent: "Hello Organizer,\n\nWe regret to inform you that your request to become an organizer has been rejected.",
          htmlContent: `
          <div style="font-family: Arial, sans-serif;">
          <h2>Organizer Application Status</h2>
          <p>Hello Organizer,</p>
          <p>We regret to inform you that your request to become an organizer has been rejected.</p>
          <p>Unfortunately, we cannot proceed with your application at this time.</p>
          <p>Thank you for considering us, and we appreciate your interest.</p>
        </div>
      `,
          params: {
            role: "Frontend",
          },
        });


        await user.save()
        return res.status(StatusCodes.OK).json({ success: false, message: "Your request to become an organizer has been rejected.", data: user })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "An error occurred while approving the organizer." })
  }
}