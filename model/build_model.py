import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

class TextEmbedder:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def embed(self, text_list):
        """
        Converts a list of text paragraphs into numerical embeddings using TF-IDF.
        Parameters:
        - text_list (list): List of text paragraphs.
        Returns:
        - numpy.ndarray: Array of embeddings with shape (n_samples, n_features).
        """
        return self.vectorizer.fit_transform(text_list).toarray()
    
import numpy as np
from sklearn.metrics import silhouette_score
from kneed import KneeLocator

class KMeans:
    def __init__(self, max_k=10, max_iter=300, tol=1e-4):
        """
        KMeans clustering with methods for finding the optimal number of clusters.
        
        Parameters:
        - max_k (int): Maximum number of clusters to test
        - max_iter (int): Maximum number of iterations for KMeans
        - tol (float): Tolerance for convergence
        """
        self.max_k = max_k
        self.max_iter = max_iter
        self.tol = tol
        self.centroids = None
        self.labels = None
        self.n_clusters = None
        
    def fit(self, X):
        """
        Fit the K-Means model to the data with the optimal number of clusters.
        
        Parameters:
        - X (numpy.ndarray): Input data of shape (n_samples, n_features)
        
        Returns:
        - tuple: (centroids, optimal_k)
        """
        # Validate input
        if not isinstance(X, np.ndarray):
            X = np.array(X)
        
        n_samples = X.shape[0]
        
        # Adjust max_k to be no larger than n_samples - 1
        self.max_k = min(self.max_k, n_samples - 1)
        
        # Find optimal k
        optimal_k = self.find_optimal_k(X)
        self.n_clusters = optimal_k
        
        # Fit final model with optimal k
        self._fit_kmeans(X, optimal_k)
        return self.centroids, optimal_k
    
    def predict(self, X):
        """
        Predict cluster labels for the data points.
        """
        if self.centroids is None:
            raise ValueError("Model must be fitted before making predictions")
        
        if not isinstance(X, np.ndarray):
            X = np.array(X)
            
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)
    
    def find_optimal_k(self, X):
        """
        Find the optimal number of clusters using both Silhouette Coefficient 
        and Elbow Method.
        """
        n_samples = X.shape[0]
        max_possible_k = min(self.max_k, n_samples - 1)
        
        if max_possible_k < 2:
            return 2  # Minimum number of clusters
            
        silhouette_k = self._find_optimal_k_silhouette(X, max_possible_k)
        elbow_k = self._find_optimal_k_elbow(X, max_possible_k)
        
        # Use the average of both methods, rounded to nearest integer
        optimal_k = max(2, min(max_possible_k, round((silhouette_k + elbow_k) / 2)))
        return optimal_k
    
    def _find_optimal_k_silhouette(self, X, max_k):
        """
        Find optimal k using Silhouette Coefficient.
        """
        best_k = 2
        best_score = -1
        
        for k in range(2, max_k + 1):
            self._fit_kmeans(X, k)
            if len(np.unique(self.labels)) > 1:
                try:
                    score = silhouette_score(X, self.labels)
                    if score > best_score:
                        best_score = score
                        best_k = k
                except ValueError:
                    continue
                    
        return best_k
    
    def _find_optimal_k_elbow(self, X, max_k):
        """
        Find optimal k using Elbow Method.
        """
        distortions = []
        k_values = range(1, max_k + 1)
        
        for k in k_values:
            self._fit_kmeans(X, k)
            distortion = np.sum(np.min(np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2), axis=1) ** 2)
            distortions.append(distortion)
        
        try:
            kneedle = KneeLocator(
                k_values, 
                distortions, 
                curve="convex", 
                direction="decreasing",
                online=True
            )
            if kneedle.knee is not None:
                return kneedle.knee
        except Exception:
            pass
            
        return self._fallback_elbow(distortions)
    
    def _fallback_elbow(self, distortions):
        """
        Fallback method to find elbow point using second derivative.
        """
        if len(distortions) < 3:
            return 2
            
        # Calculate second derivative
        gradients = np.gradient(distortions)
        second_derivative = np.gradient(gradients)
        
        # Find the point of maximum curvature
        elbow_index = np.argmax(np.abs(second_derivative[1:-1])) + 1
        return elbow_index + 1  # Add 1 because k starts from 1
    
    def _fit_kmeans(self, X, n_clusters):
        """
        Internal method to fit KMeans with a given number of clusters.
        """
        n_samples = X.shape[0]
        
        # Initialize centroids using k-means++
        self.centroids = self._kmeans_plus_plus_init(X, n_clusters)
        
        for _ in range(self.max_iter):
            old_centroids = self.centroids.copy()
            
            # Assign clusters
            self.labels = self._assign_clusters(X)
            
            # Update centroids
            for k in range(n_clusters):
                if np.sum(self.labels == k) > 0:  # Only update if cluster has points
                    self.centroids[k] = X[self.labels == k].mean(axis=0)
            
            # Check convergence
            if np.all(np.abs(old_centroids - self.centroids) < self.tol):
                break
                
    def _kmeans_plus_plus_init(self, X, n_clusters):
        """
        Initialize centroids using k-means++ algorithm.
        """
        n_samples = X.shape[0]
        centroids = [X[np.random.randint(n_samples)]]
        
        for _ in range(1, n_clusters):
            distances = np.min([np.linalg.norm(X - c, axis=1) ** 2 for c in centroids], axis=0)
            probs = distances / distances.sum()
            cumprobs = np.cumsum(probs)
            r = np.random.random()
            
            for j, p in enumerate(cumprobs):
                if r < p:
                    centroids.append(X[j])
                    break
                    
        return np.array(centroids)
    
    def _assign_clusters(self, X):
        """
        Assign data points to nearest centroid.
        """
        distances = np.linalg.norm(X[:, np.newaxis] - self.centroids, axis=2)
        return np.argmin(distances, axis=1)
    
import numpy as np
from scipy.stats import multivariate_normal

class GMM:
    def __init__(self, n_components, max_iter=100, tol=1e-3, reg_covar=1e-6, initial_means=None):
        """
        Gaussian Mixture Model for clustering.
        """
        self.n_components = n_components
        self.max_iter = max_iter
        self.tol = tol
        self.reg_covar = reg_covar
        self.initial_means = initial_means
        self.means = None
        self.covariances = None
        self.weights = None

    def fit(self, X):
        """
        Fit the GMM model to the data.
        """
        n_samples, n_features = X.shape
        
        # Initialize means
        if self.initial_means is not None:
            self.means = self.initial_means
        else:
            indices = np.random.choice(n_samples, self.n_components, replace=False)
            self.means = X[indices]

        # Initialize covariances with data-driven values
        self.covariances = np.array([
            np.cov(X.T) + np.eye(n_features) * self.reg_covar 
            for _ in range(self.n_components)
        ])
        
        # Initialize weights
        self.weights = np.ones(self.n_components) / self.n_components
        
        prev_log_likelihood = None
        
        for _ in range(self.max_iter):
            try:
                # E-step
                responsibilities = self._e_step(X)
                
                # M-step
                self._m_step(X, responsibilities)
                
                # Check convergence
                log_likelihood = self._compute_log_likelihood(X)
                if prev_log_likelihood is not None:
                    change = abs(log_likelihood - prev_log_likelihood)
                    if change < self.tol:
                        break
                prev_log_likelihood = log_likelihood
                
            except np.linalg.LinAlgError:
                self.reg_covar *= 10
                continue
    
    def predict(self, X):
        """
        Predict cluster assignments.
        """
        probabilities = self._e_step(X)
        return np.argmax(probabilities, axis=1)

    def _e_step(self, X):
        """
        E-step: Compute responsibilities.
        """
        n_samples = X.shape[0]
        responsibilities = np.zeros((n_samples, self.n_components))
        
        for k in range(self.n_components):
            try:
                # Add regularization to ensure positive definiteness
                cov = self.covariances[k] + np.eye(X.shape[1]) * self.reg_covar
                
                # Ensure symmetry
                cov = (cov + cov.T) / 2
                
                rv = multivariate_normal(
                    mean=self.means[k],
                    cov=cov,
                    allow_singular=True
                )
                density = rv.pdf(X)
                responsibilities[:, k] = self.weights[k] * np.maximum(density, np.finfo(float).tiny)
            except:
                responsibilities[:, k] = np.finfo(float).tiny
        
        # Normalize responsibilities
        row_sums = responsibilities.sum(axis=1)
        responsibilities /= row_sums[:, np.newaxis]
        
        return responsibilities

    def _m_step(self, X, responsibilities):
        """
        M-step: Update parameters.
        """
        n_samples, n_features = X.shape
        
        # Update weights (mixing coefficients)
        Nk = responsibilities.sum(axis=0)
        self.weights = Nk / n_samples
        
        # Update means
        self.means = np.dot(responsibilities.T, X) / Nk[:, np.newaxis]
        
        # Update covariances
        for k in range(self.n_components):
            diff = X - self.means[k]
            weighted_diff = responsibilities[:, k:k+1] * diff
            cov = np.dot(weighted_diff.T, diff) / Nk[k]
            
            # Ensure covariance matrix is well-conditioned
            min_eig = np.linalg.eigvalsh(cov).min()
            if min_eig < self.reg_covar:
                cov += np.eye(n_features) * (self.reg_covar - min_eig)
            
            self.covariances[k] = cov
    
    def _compute_log_likelihood(self, X):
        """
        Compute the log-likelihood of the data.
        """
        n_samples = X.shape[0]
        likelihood = np.zeros((n_samples, self.n_components))
        
        for k in range(self.n_components):
            cov = self.covariances[k] + np.eye(X.shape[1]) * self.reg_covar
            rv = multivariate_normal(mean=self.means[k], cov=cov, allow_singular=True)
            likelihood[:, k] = self.weights[k] * rv.pdf(X)
        
        return np.sum(np.log(np.sum(likelihood, axis=1)))
    
class DoubtClustering:
    def __init__(self, max_k=10):
        self.max_k = max_k

    def cluster(self, text_paragraphs):
        """
        Cluster the text paragraphs using an ensemble of KMeans and GMM.

        Parameters:
        - text_paragraphs (list of str): Text paragraphs to be clustered.

        Returns:
        - dict: A dictionary where keys are cluster labels, and values are lists of text paragraphs in each cluster.
        """
        # Step 1: Convert text to embeddings
        embedder = TextEmbedder()
        embeddings = embedder.embed(text_paragraphs)

        # Step 2: Find optimal K using Elbow Method and Perform K-means to perform Clusters
        kmeans = KMeans(max_k=10)
        centroids, optimal_k = kmeans.fit(embeddings)
        # Step 4: Refine using GMM with KMeans centroids as initial means
        gmm = GMM(n_components=optimal_k if optimal_k is not None else 4, initial_means=centroids)  # Pass KMeans centroids to GMM)
        gmm.fit(embeddings)
        gmm_labels = gmm.predict(embeddings)

        # Organize clusters into a dictionary
        clusters = {}
        for i, label in enumerate(gmm_labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(text_paragraphs[i])

        return clusters
