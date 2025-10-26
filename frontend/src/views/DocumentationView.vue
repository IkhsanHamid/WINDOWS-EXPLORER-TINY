<template>
  <div class="docs-container">
    <!-- Header -->
    <header class="docs-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">📚 Documentation</h1>
        </div>
        <search-bar
          :search-query="searchQuery"
          :search-results="searchResults"
          :is-searching="isSearching"
          :has-results="hasResults"
          @search="handleSearch"
          @select-folder="handleSelectSearchFolder"
        />
      </div>
    </header>

    <!-- Main Content -->
    <div class="docs-main">
      <!-- Sidebar Navigation -->
      <aside class="docs-sidebar">
        <nav class="nav-sections">
          <div class="nav-section">
            <h3 class="nav-title">Getting Started</h3>
            <ul class="nav-list">
              <li><a href="#" class="nav-link active">Introduction</a></li>
              <li><a href="#" class="nav-link">Installation</a></li>
              <li><a href="#" class="nav-link">Quick Start</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-title">Core Concepts</h3>
            <ul class="nav-list">
              <li><a href="#" class="nav-link">Architecture</a></li>
              <li><a href="#" class="nav-link">Components</a></li>
              <li><a href="#" class="nav-link">State Management</a></li>
              <li><a href="#" class="nav-link">Routing</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-title">API Reference</h3>
            <ul class="nav-list">
              <li><a href="#" class="nav-link">REST API</a></li>
              <li><a href="#" class="nav-link">Authentication</a></li>
              <li><a href="#" class="nav-link">Error Handling</a></li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-title">Guides</h3>
            <ul class="nav-list">
              <li><a href="#" class="nav-link">Deployment</a></li>
              <li><a href="#" class="nav-link">Performance</a></li>
              <li><a href="#" class="nav-link">Security</a></li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="docs-content">
        <article class="doc-article">
          <div class="article-header">
            <h2>Introduction</h2>
            <p class="article-meta">Last updated 2 days ago</p>
          </div>

          <div class="article-body">
            <p>
              Welcome to our comprehensive documentation. This guide will help
              you understand and use our platform effectively.
            </p>

            <h3>What is this?</h3>
            <p>
              This is a modern documentation system built with Vue.js. It
              provides a clean, intuitive interface for browsing and searching
              documentation content.
            </p>

            <h3>Key Features</h3>
            <ul class="feature-list">
              <li>Fast search across all documentation</li>
              <li>Organized navigation structure</li>
              <li>Responsive design for all devices</li>
              <li>Code examples and snippets</li>
              <li>Easy to navigate and understand</li>
            </ul>

            <h3>Getting Started</h3>
            <p>
              To get started, explore the navigation menu on the left or use the
              search bar at the top to find what you're looking for.
            </p>

            <div class="code-block">
              <pre><code>// Example code
const greeting = "Welcome to Documentation";
console.log(greeting);</code></pre>
            </div>

            <h3>Next Steps</h3>
            <p>
              Check out the <a href="#" class="doc-link">Installation</a> guide
              to set up your environment, or jump to
              <a href="#" class="doc-link">Quick Start</a> for a hands-on
              introduction.
            </p>
          </div>

          <div class="article-footer">
            <div class="article-nav">
              <button class="nav-button prev-button" disabled>
                ← Previous
              </button>
              <button class="nav-button next-button">Next →</button>
            </div>
          </div>
        </article>

        <!-- Right Sidebar - Table of Contents -->
        <aside class="docs-toc">
          <div class="toc-section">
            <h4 class="toc-title">On this page</h4>
            <ul class="toc-list">
              <li><a href="#" class="toc-link">What is this?</a></li>
              <li><a href="#" class="toc-link">Key Features</a></li>
              <li><a href="#" class="toc-link">Getting Started</a></li>
              <li><a href="#" class="toc-link">Next Steps</a></li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "../components/SearchBar.vue";
import { useSearch } from "../composables/useSearch";

const { searchQuery, searchResults, isSearching, hasResults } = useSearch();

const handleSearch = async () => {
  // All hooks must be called in the exact same order in every component render
  // This is a placeholder for the actual search logic
};

const handleSelectSearchFolder = (folderId: string) => {
  console.log("Selected folder:", folderId);
};
</script>

<style scoped>
.docs-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

/* Header */
.docs-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 20px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.logo-section {
  flex-shrink: 0;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Main Layout */
.docs-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.docs-sidebar {
  width: 280px;
  background-color: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 24px 0;
}

.nav-sections {
  list-style: none;
}

.nav-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  display: block;
  padding: 8px 12px;
  color: #374151;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.nav-link:hover {
  background-color: #e5e7eb;
  color: #1a1a2e;
}

.nav-link.active {
  background-color: #dbeafe;
  color: #1e40af;
  border-left-color: #1e40af;
  font-weight: 500;
}

/* Content Area */
.docs-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: #ffffff;
}

.doc-article {
  flex: 1;
  overflow-y: auto;
  padding: 48px 64px;
  max-width: 800px;
}

.article-header {
  margin-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 24px;
}

.article-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.article-meta {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.article-body {
  color: #374151;
  line-height: 1.8;
}

.article-body p {
  margin-bottom: 16px;
  font-size: 15px;
}

.article-body h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 32px 0 16px 0;
}

.article-body ul {
  margin: 16px 0 16px 24px;
  padding: 0;
}

.article-body li {
  margin-bottom: 8px;
  color: #374151;
}

.feature-list {
  list-style-type: disc;
}

.code-block {
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 16px;
  margin: 24px 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 13px;
  color: #e5e7eb;
  line-height: 1.6;
}

.doc-link {
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.doc-link:hover {
  border-bottom-color: #1e40af;
}

.article-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.article-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.nav-button {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.next-button {
  margin-left: auto;
}

/* Table of Contents */
.docs-toc {
  width: 240px;
  padding: 48px 24px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  background-color: #fafbfc;
}

.toc-section {
  position: sticky;
  top: 0;
}

.toc-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-link {
  display: block;
  padding: 6px 0;
  color: #6b7280;
  text-decoration: none;
  font-size: 13px;
  border-left: 2px solid transparent;
  padding-left: 12px;
  transition: all 0.2s ease;
}

.toc-link:hover {
  color: #1a1a2e;
  border-left-color: #1e40af;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive */
@media (max-width: 1024px) {
  .docs-toc {
    display: none;
  }

  .doc-article {
    padding: 32px 48px;
  }
}

@media (max-width: 768px) {
  .docs-sidebar {
    width: 240px;
  }

  .doc-article {
    padding: 24px 32px;
    max-width: 100%;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .logo {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .docs-main {
    flex-direction: column;
  }

  .docs-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    max-height: 200px;
  }

  .doc-article {
    padding: 16px 20px;
  }

  .article-header h2 {
    font-size: 24px;
  }
}
</style>
