const POST_GRAPHQL_FIELDS = `
  slug
  title
  coverImage {
    url
  }
  date
  author {
    ... on Author {
      name
      picture {
        url
      }
    }
  }
  excerpt
  content {
    json
  }
`;

async function fetchGraphQL(query: string, preview = false): Promise<any> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID?.trim();
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN?.trim() ||
      process.env.CONTENTFUL_ACCESS_TOKEN?.trim()
    : process.env.CONTENTFUL_ACCESS_TOKEN?.trim();

  if (!spaceId) {
    const errorMsg =
      "Contentful configuration error: CONTENTFUL_SPACE_ID is not configured or is empty. " +
      "Please ensure CONTENTFUL_SPACE_ID is set in your environment / GitLab CI/CD variables (uncheck 'Protect variable' if running on feature branches/MRs).";
    console.error(errorMsg);
    return { errors: [{ message: errorMsg }] };
  }

  if (!token) {
    const tokenName = preview
      ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN (or CONTENTFUL_ACCESS_TOKEN)"
      : "CONTENTFUL_ACCESS_TOKEN";
    const errorMsg =
      `Contentful configuration error: ${tokenName} is not configured or is empty. ` +
      `Please ensure ${tokenName} is set in your environment / GitLab CI/CD variables (uncheck 'Protect variable' if running on feature branches/MRs).`;
    console.error(errorMsg);
    return { errors: [{ message: errorMsg }] };
  }

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${encodeURIComponent(spaceId)}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      next: { tags: ["posts"] },
    });
  } catch (networkError: any) {
    const errorMsg = `Contentful API network request failed for space '${spaceId}': ${networkError.message}`;
    console.error(errorMsg);
    return { errors: [{ message: errorMsg }] };
  }

  const contentType = response.headers?.get
    ? response.headers.get("content-type") || ""
    : "application/json";

  // Guard against HTML error pages (e.g. 404 from empty space ID or 502/503 proxy errors)
  if (
    contentType &&
    !contentType.includes("application/json") &&
    typeof response.text === "function"
  ) {
    const rawBody = await response.text();
    const cleanSnippet = rawBody
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);
    const statusText = response.status
      ? `(HTTP ${response.status} ${response.statusText || ""})`
      : "";
    const errorMsg = `Contentful API returned an unexpected non-JSON response ${statusText} [Content-Type: ${contentType}]: ${cleanSnippet || "empty response body"}`;
    console.error(errorMsg);
    return { errors: [{ message: errorMsg }] };
  }

  let json: any;
  try {
    json = await response.json();
  } catch (parseError: any) {
    const errorMsg = `Failed to parse Contentful API response as JSON (HTTP ${response.status || "unknown"} ${response.statusText || ""}): ${parseError.message}`;
    console.error(errorMsg);
    return { errors: [{ message: errorMsg }] };
  }

  if (response.ok === false) {
    const apiErrors = json?.errors?.map((e: any) => e.message).join("; ");
    const errorDetail =
      apiErrors || json?.message || response.statusText || "Request failed";
    console.error(
      `Contentful API request failed (HTTP ${response.status} ${response.statusText || ""}): ${errorDetail}`,
    );
    return json;
  }

  if (json?.errors && json.errors.length > 0) {
    const errorMessages = json.errors.map((e: any) => e.message).join("; ");
    console.error(`Contentful GraphQL query returned errors: ${errorMessages}`);
  }

  return json;
}

function extractPost(fetchResponse: any): any {
  return fetchResponse?.data?.postCollection?.items?.[0];
}

function extractPostEntries(fetchResponse: any): any[] {
  if (!fetchResponse?.data?.postCollection?.items) {
    console.error("Failed to fetch posts from Contentful:", fetchResponse);
    return [];
  }
  return fetchResponse.data.postCollection.items;
}

export async function getPreviewPostBySlug(slug: string | null): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true,
  );
  return extractPost(entry);
}

export async function getAllPosts(isDraftMode: boolean): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC, preview: ${
        isDraftMode ? "true" : "false"
      }) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode,
  );
  return extractPostEntries(entries);
}

export async function getPostAndMorePosts(
  slug: string,
  preview: boolean,
): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
        preview ? "true" : "false"
      }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview,
  );
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
        preview ? "true" : "false"
      }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview,
  );
  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  };
}
