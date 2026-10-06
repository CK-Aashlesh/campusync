/**
 * CampuSync – Student account created email template
 *
 * Usage (inside your existing email backend):
 *
 *   const { buildStudentWelcomeEmail } = require("./campusyncWelcomeEmail");
 *
 *   const { subject, html, text } = buildStudentWelcomeEmail({
 *     studentName,
 *     studentEmail,
 *     temporaryPassword,
 *     loginUrl,
 *   });
 *
 *   // pass subject / html / text to your existing sender (nodemailer, SES, etc.)
 *
 * Notes
 * - Pure function: no side effects, no logging, no network calls.
 * - The temporary password is only ever rendered in the credentials box
 *   (and the plain-text fallback). It is never placed in the preheader,
 *   links, alt text or anywhere else.
 * - Values are HTML-escaped, so characters like < > & " ' display exactly
 *   as received and cannot break the markup.
 */

const BRAND = {
  name: "CampuSync",
  tagline: "Student Management Platform",
  blue: "#1658cd",
  blueDark: "#0c44b0",
  blueLight: "#f4f7fc",
  blueBorder: "#c8d9f9",
  text: "#000000",
  muted: "#64748B",
  pageBg: "#e9edf5",
};

// Footer links (shown only when a URL is set). Fill these in with real URLs.
const FOOTER_LINKS = {
  follow: [
    { label: "X", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
  ],
  resources: [{ label: "Help Center", url: "" }],
};

function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStudentWelcomeEmail({
  studentName,
  studentEmail,
  temporaryPassword,
  loginUrl,
  heroImageUrl, // absolute https URL of campusync-welcome-hero.png (host it on your site/CDN)
}) {
  const subject = "Your CampuSync Account Is Ready";

  const name = escapeHtml(studentName);
  const email = escapeHtml(studentEmail);
  const password = escapeHtml(temporaryPassword);
  const url = escapeHtml(loginUrl);
  const hero = heroImageUrl ? escapeHtml(heroImageUrl) : "";

  const linkList = (items) =>
    items
      .filter((l) => l.url)
      .map(
        (l) =>
          `<a href="${escapeHtml(l.url)}" target="_blank" style="color:${BRAND.text};font-size:14px;line-height:24px;">${escapeHtml(l.label)}</a><br>`,
      )
      .join("");
  const followHtml = linkList(FOOTER_LINKS.follow);
  const resourcesHtml = linkList(FOOTER_LINKS.resources);

  const font =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  body { margin:0; padding:0; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  @media only screen and (max-width:620px) {
    .outer-pad { padding:12px !important; }
    .card { border-radius:20px !important; }
    
    .hero-title { font-size:30px !important; line-height:36px !important; }
    .body-pad { padding:28px 24px !important; }
    .pw-value { font-size:20px !important; }
    .btn-link { display:block !important; }
    .stack { display:block !important; width:100% !important; padding:0 0 20px 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.pageBg};">

<!-- Preheader (hidden). Intentionally contains no credentials. -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
  Your CampuSync student account has been created. Sign in to get started.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.pageBg}" style="background-color:${BRAND.pageBg};">
<tr>
<td align="center" class="outer-pad" style="padding:32px 16px;">

  <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:28px;overflow:hidden;">

    <!-- Hero -->
    <tr>
      <td class="hero" align="center" bgcolor="#F8FAFC" style="background-color:#F8FAFC;padding:0;font-size:0;line-height:0;">
        ${
          hero
            ? `<img src="${hero}" width="600" alt="Welcome to CampuSync" style="display:block;width:100%;max-width:600px;height:auto;border:0;">`
            : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" style="padding:44px 40px;font-family:${font};"><div style="font-size:13px;line-height:20px;letter-spacing:3px;text-transform:uppercase;color:${BRAND.blueDark};font-weight:600;">Welcome to</div><div class="hero-title" style="font-size:40px;line-height:46px;font-weight:800;color:${BRAND.text};letter-spacing:-1px;">${BRAND.name}</div></td></tr></table>`
        }
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td class="body-pad" style="padding:36px 40px 12px 40px;font-family:${font};color:${BRAND.text};">
        <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px 0;font-size:16px;line-height:24px;">
          Your CampuSync student account has been created successfully. You can now access your account using the temporary credentials below.
        </p>

        <!-- Credentials -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.blueLight}" style="background-color:${BRAND.blueLight};border:1px solid ${BRAND.blueBorder};border-radius:16px;">
          <tr>
            <td style="padding:22px 24px 6px 24px;font-family:${font};">
              <div style="font-size:11px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};font-weight:600;">Login Email</div>
              <div style="font-size:16px;line-height:24px;color:${BRAND.text};font-weight:600;word-break:break-all;padding-top:2px;">${email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px 24px;font-family:${font};">
              <div style="font-size:11px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};font-weight:600;padding-bottom:8px;">Temporary Password</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:2px dashed ${BRAND.blue};border-radius:12px;">
                <tr>
                  <td align="center" class="pw-value" style="padding:16px 12px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,'Courier New',monospace;font-size:24px;line-height:30px;font-weight:700;letter-spacing:1px;color:${BRAND.blueDark};word-break:break-all;">${password}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Security note -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
          <tr>
            <td bgcolor="#FFF7ED" style="background-color:#FFF7ED;border-left:4px solid #F59E0B;border-radius:8px;padding:14px 16px;font-family:${font};font-size:14px;line-height:21px;color:#7C2D12;">
              <strong>Important:</strong> For your security, please change your password after your first login.
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:28px;">
          <tr>
            <td align="left">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="25%" stroke="f" fillcolor="${BRAND.blue}">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Login to CampuSync &rarr;</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-- -->
              <a href="${url}" class="btn-link" target="_blank" style="display:inline-block;background-color:${BRAND.blue};color:#FFFFFF;font-family:${font};font-size:16px;font-weight:600;line-height:48px;text-align:center;padding:0 32px;border-radius:12px;">Login to CampuSync &rarr;</a>
              <!--<![endif]-->
            </td>
          </tr>
        </table>

        <p style="margin:28px 0 0 0;font-size:14px;line-height:21px;color:${BRAND.muted};">
          If you did not expect this account or believe this email was sent to you by mistake, please contact your college administrator.
        </p>
        <p style="margin:20px 0 0 0;font-size:16px;line-height:24px;">We're excited to have you on CampuSync.</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:32px 40px 40px 40px;font-family:${font};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="stack" valign="top" style="padding-right:16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td align="center" valign="middle" width="24" height="24" bgcolor="${BRAND.blue}" style="background-color:${BRAND.blue};border-radius:6px;width:24px;height:24px;font-size:14px;font-weight:700;color:#FFFFFF;line-height:24px;">C</td>
                <td style="padding-left:8px;font-size:14px;font-weight:600;color:${BRAND.text};">${BRAND.name}</td>
              </tr></table>
              <div style="font-size:30px;line-height:34px;font-weight:800;color:${BRAND.text};letter-spacing:-1px;padding-top:16px;">Ready to get<br><span style="font-style:italic;">started?</span></div>
              <div style="padding-top:16px;font-size:14px;line-height:20px;"><a href="${url}" target="_blank" style="color:${BRAND.text};text-decoration:underline;">&#8599;&nbsp; Login to CampuSync</a></div>
            </td>
            ${
              followHtml || resourcesHtml
                ? `<td class="stack" valign="top" align="left" style="padding-top:4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                ${followHtml ? `<td valign="top" style="padding-right:28px;"><div style="font-size:15px;font-weight:700;color:${BRAND.text};padding-bottom:8px;">Follow On</div>${followHtml}</td>` : ""}
                ${resourcesHtml ? `<td valign="top"><div style="font-size:15px;font-weight:700;color:${BRAND.text};padding-bottom:8px;">Resources</div>${resourcesHtml}</td>` : ""}
              </tr></table>
            </td>`
                : ""
            }
          </tr>
        </table>
        <div style="border-top:1px solid #E2E8F0;margin-top:28px;padding-top:16px;font-size:12px;line-height:18px;color:${BRAND.muted};">
            ${BRAND.name} &middot; ${BRAND.tagline}<br><br>
            Please do not reply to this mail, it is an auto-generated mail.<br>
            &copy; ${new Date().getFullYear()} Copyright reserved to aashlesh
          </div>
      </td>
    </tr>

  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td>
</tr>
</table>
</body>
</html>`;

  // Plain-text alternative (improves deliverability and accessibility)
  const text = [
    `Hi ${studentName},`,
    "",
    "Welcome to CampuSync! Your student account has been created successfully.",
    "",
    "Use the temporary credentials below to log in:",
    "",
    `Login Email: ${studentEmail}`,
    `Temporary Password: ${temporaryPassword}`,
    "",
    "Important: For your security, please change your password after your first login.",
    "",
    `Login to CampuSync: ${loginUrl}`,
    "",
    "If you did not expect this account or believe this email was sent to you by mistake, please contact your college administrator.",
    "",
    "We're excited to have you on CampuSync.",
    "",
    "CampuSync",
    "Student Management Platform",
    "",
    "Please do not reply to this mail, it is an auto-generated mail.",
    "Copyright reserved to aashlesh",
  ].join("\n");

  return { subject, html, text };
}

module.exports = { buildStudentWelcomeEmail };
