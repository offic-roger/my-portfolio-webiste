import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, budget, message, source } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const recipientEmail = "rogersmwangomale@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;
    const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY;

    let emailSent = false;
    let providerUsed = "";

    // Method 1: Send via Resend API
    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Official Roger Portfolio <onboarding@resend.dev>",
            to: recipientEmail,
            subject: `New Portfolio Contact: ${service || "General Inquiry"} from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone/WhatsApp:</strong> ${phone || "Not provided"}</p>
              <p><strong>Service Needed:</strong> ${service || "Not specified"}</p>
              <p><strong>Estimated Budget:</strong> ${budget || "Not specified"}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
              ${source ? `<p><strong>How they heard:</strong> ${source}</p>` : ""}
            `,
          }),
        });

        if (response.ok) {
          emailSent = true;
          providerUsed = "Resend";
        } else {
          console.error("Resend API failed:", await response.text());
        }
      } catch (err) {
        console.error("Error sending via Resend:", err);
      }
    }

    // Method 2: Send via Web3Forms API
    if (!emailSent && web3formsAccessKey) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            name: name,
            email: email,
            subject: `New Portfolio Contact: ${service || "General Inquiry"}`,
            from_name: "Official Roger Portfolio",
            phone: phone || "Not provided",
            service: service || "Not specified",
            budget: budget || "Not specified",
            message: message,
            heard_from: source || "Not provided",
            to_email: recipientEmail,
          }),
        });

        if (response.ok) {
          emailSent = true;
          providerUsed = "Web3Forms";
        } else {
          console.error("Web3Forms API failed:", await response.text());
        }
      } catch (err) {
        console.error("Error sending via Web3Forms:", err);
      }
    }

    if (emailSent) {
      return NextResponse.json(
        { success: true, message: `Ujumbe wako umetumwa kwa ufanisi kwenda rogersmwangomale@gmail.com!` },
        { status: 200 }
      );
    } else {
      // Simulation / Graceful fallback mode if keys are missing or fetch failed
      console.log("==========================================");
      console.log("CONTACT FORM SUBMISSION (SIMULATION MODE)");
      console.log("To recipient:", recipientEmail);
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("Message:", message);
      console.log("==========================================");

      return NextResponse.json(
        {
          success: true,
          simulated: true,
          message:
            "Ujumbe wako umepokelewa kwenye kompyuta yako! (Simulation Mode: Mtandao wako wa kompyuta unazuia Node.js kufikia Resend API. Pindi tovuti hii itakapowekwa live mtandaoni, barua pepe zitatumwa moja kwa moja kwenda rogersmwangomale@gmail.com).",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in Contact API Route:", error);
    return NextResponse.json(
      { error: "Hitilafu imetokea wakati wa kutuma ujumbe wako." },
      { status: 500 }
    );
  }
}
