import { useEffect } from "react";

const SITE_NAME = "Little Lemon";

// Sets the browser tab title for the current page so screen reader users and tab lists can tell pages apart.
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Mediterranean Restaurant in Chicago`;
  }, [title]);
}
