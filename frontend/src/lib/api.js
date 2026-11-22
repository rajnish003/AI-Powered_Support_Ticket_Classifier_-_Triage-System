const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Helper to handle fetch responses and error extraction
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === "string" 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // response wasn't JSON, retain generic message
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Check backend health status
 * GET /
 */
export async function getHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      cache: "no-store",
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to connect to backend: ${error.message}`);
  }
}

/**
 * Retrieve all tickets from database
 * GET /api/tickets
 */
export async function getTickets() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: "GET",
      cache: "no-store",
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to load tickets: ${error.message}`);
  }
}

/**
 * Retrieve a specific ticket by ID
 * GET /api/tickets/{ticket_id}
 */
export async function getTicketById(id) {
  if (!id) throw new Error("Ticket ID is required");
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to load ticket #${id}: ${error.message}`);
  }
}

/**
 * Create a new ticket and run ML prediction
 * POST /api/tickets/predict
 */
export async function createTicket(text) {
  if (!text || text.trim().length < 5) {
    throw new Error("Complaint text must be at least 5 characters long");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text.trim() }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to submit ticket: ${error.message}`);
  }
}

/**
 * Update the status of an existing ticket
 * PATCH /api/tickets/{ticket_id}/status
 * Allowed: 'Pending', 'In Progress', 'Resolved'
 */
export async function updateTicketStatus(id, status) {
  const allowed = ["Pending", "In Progress", "Resolved"];
  if (!allowed.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of: ${allowed.join(", ")}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update status for ticket #${id}: ${error.message}`);
  }
}

