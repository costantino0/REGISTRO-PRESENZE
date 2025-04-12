// ✅ Native fetch — no need to import

exports.handler = async (event) => {
  try {
    const { name, latitude, longitude, accuracy, type } = JSON.parse(event.body);

    const baseId = "appRs0OLbQJLYspf5"; // ✅ Il tuo Airtable Base ID
    const tableName = "REGISTRO DELLE PRESENZE";
    const airtableKey = process.env.AIRTABLE_API_KEY;

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Name/ID": name,
            "Latitude": latitude,
            "Longitude": longitude,
            "Accuratezza (m)": accuracy,      // 🟡 Nuovo campo
            "Tipo timbratura": type        // 🟢 Nuovo campo
          },
        }),
      }
    );

    const contentType = airtableResponse.headers.get("content-type");
    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await airtableResponse.json();
    }

    if (!airtableResponse.ok) {
      return {
        statusCode: airtableResponse.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          error: data?.error?.message || "Airtable error",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        data: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
};

