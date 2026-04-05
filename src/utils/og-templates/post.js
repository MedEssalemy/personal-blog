import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async post => {
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
                      type: "p",
                      props: {
                        style: {
                          fontSize: 60,
                          fontWeight: "bold",
                          color: "#e2e8f0",
                          maxHeight: "80%",
                          overflow: "hidden",
                          lineHeight: 1.3,
                          margin: 0,
                        },
                        children: post.data.title,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          fontSize: 24,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: { color: "#94a3b8" },
                              children: post.data.author ?? SITE.author,
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                fontWeight: "bold",
                                color: "#64748b",
                              },
                              children: SITE.title,
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
      fonts: await loadGoogleFonts(
        post.data.title + (post.data.author ?? SITE.author) + SITE.title
      ),
    }
  );
};
