import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

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
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "40px",
                    width: "90%",
                    height: "85%",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: "90%",
                          maxHeight: "90%",
                          overflow: "hidden",
                        },
                        children: [
                          {
                            type: "p",
                            props: {
                              style: {
                                fontSize: 72,
                                fontWeight: "bold",
                                color: "#e2e8f0",
                                margin: 0,
                              },
                              children: SITE.title,
                            },
                          },
                          {
                            type: "p",
                            props: {
                              style: {
                                fontSize: 28,
                                color: "#94a3b8",
                                marginTop: "12px",
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
                          color: "#64748b",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: SITE.author,
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { fontWeight: "bold", color: "#94a3b8" },
                              children: new URL(SITE.website).hostname,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
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
