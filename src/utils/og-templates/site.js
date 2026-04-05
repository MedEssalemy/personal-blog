import fs from "fs";
import path from "path";
import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const profileImagePath = path.resolve("public/profile.png");
const profileImageBase64 = `data:image/png;base64,${fs.readFileSync(profileImagePath).toString("base64")}`;

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "#1a1a2e",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                border: "2px solid #334155",
                background: "#0f172a",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
                padding: "40px",
                gap: "48px",
              },
              children: [
                {
                  type: "img",
                  props: {
                    src: profileImageBase64,
                    style: {
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: "3px solid #334155",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      flex: 1,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", flexDirection: "column" },
                          children: [
                            {
                              type: "p",
                              props: {
                                style: {
                                  fontSize: 68,
                                  fontWeight: "bold",
                                  color: "#e2e8f0",
                                  margin: 0,
                                  lineHeight: 1.1,
                                },
                                children: SITE.title,
                              },
                            },
                            {
                              type: "p",
                              props: {
                                style: {
                                  fontSize: 26,
                                  color: "#94a3b8",
                                  marginTop: "16px",
                                  lineHeight: 1.4,
                                },
                                children: SITE.desc,
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            fontSize: 22,
                          },
                          children: [
                            {
                              type: "span",
                              props: {
                                style: { color: "#94a3b8" },
                                children: SITE.author,
                              },
                            },
                            {
                              type: "span",
                              props: {
                                style: { color: "#64748b" },
                                children: new URL(SITE.website).hostname,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(SITE.title + SITE.desc + SITE.author),
    }
  );
};
