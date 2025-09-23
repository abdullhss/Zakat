// components/SimpleTestComponent.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  selectNewsData,
  selectProjectsData,
  selectDataLoading,
  selectDataError,
  clearError,
} from "../store/slices/fetchData";

const SimpleTestComponent = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const newsData = useSelector(selectNewsData);
  const projectsData = useSelector(selectProjectsData);
  const loading = useSelector(selectDataLoading);
  const error = useSelector(selectDataError);

  // Procedure configuration
  const procedureValues = {
    procedureName: "I0uFFxOqnfWgAy1EbMHIi+epTgwWrmYV51/bDxo0U0s=",
    parameters: "0",
  };

  // Fetch data on component mount
  useEffect(() => {
    handleApiCall();
  }, []);

  const handleApiCall = () => {
    dispatch(clearError());
    dispatch(fetchData(procedureValues));
  };

  return (
    <div
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      dir="ltr"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Projects Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          Projects ({projectsData.length})
        </h2>
        {projectsData.map((project) => (
          <div key={project.Id} className="mb-4 p-4 border rounded-lg">
            <h3 className="font-semibold">{project.ProjectName}</h3>
            <p className="text-sm text-gray-600">{project.ProjectDesc}</p>
            <div className="mt-2 text-sm">
              <span
                className={`px-2 py-1 rounded ${
                  project.IsActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {project.IsActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* News Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">News ({newsData.length})</h2>
        {newsData.map((news) => (
          <div key={news.Id} className="mb-4 p-4 border rounded-lg">
            <h3 className="font-semibold" dir="rtl">
              {news.NewsMainTitle}
            </h3>
            <h4 className="text-sm text-gray-600" dir="rtl">
              {news.NewsSubTitle}
            </h4>
            <p className="mt-2 text-sm" dir="rtl">
              {news.NewsContents.substring(0, 200)}...
            </p>
            <div className="mt-2 text-xs text-gray-500">
              Office: {news.OfficeName} | Created:{" "}
              {new Date(news.NewsCreateDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </section>

      {/* Refresh Button */}
      <button
        onClick={handleApiCall}
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-lg font-medium"
      >
        {loading ? "Loading..." : "Refresh Data"}
      </button>

      {/* Data Stats */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        News: {newsData.length} | Projects: {projectsData.length}
      </div>
    </div>
  );
};

export default SimpleTestComponent;
