import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Job interface
export interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  type: string;
  addedBy: string;
  createdById: string;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

// Fetch all jobs
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const response = await fetch("http://localhost:3000/jobs");
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return (await response.json()) as Job[];
});

// Add a new job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (job: Omit<Job, "id">) => {
    const response = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error("Failed to add job");
    }
    return (await response.json()) as Job;
  }
);

// Update an existing job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, updatedJob }: { id: string; updatedJob: Partial<Job> }) => {
    const response = await fetch(`http://localhost:3000/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJob),
    });
    if (!response.ok) {
      throw new Error("Failed to update job");
    }
    return (await response.json()) as Job;
  }
);

// Delete a job
export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id: string) => {
  const response = await fetch(`http://localhost:3000/jobs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete job");
  }
  return id;
});

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.map((job) => ({
          ...job,
          createdById: job.createdById || "unknown",
        }));
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch jobs";
      })
      // Add Job
      .addCase(addJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(addJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add job";
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update job";
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete job";
      });
  },
});

export default jobsSlice.reducer;