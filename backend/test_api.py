import requests
import json

def test_backend():
    try:
        # Test health endpoint
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        print(f"Health check status: {response.status_code}")
        print(f"Health check response: {response.json()}")
        
        # Test with a simple file upload
        import io
        from requests_toolbelt.multipart.encoder import MultipartEncoder
        
        # Create a simple test file content
        test_file_content = b"Test resume content with Python and SQL skills"
        job_description = "Looking for a Python developer with SQL experience"
        
        # Create multipart form data
        multipart_data = MultipartEncoder(
            fields={
                'resume': ('test.txt', test_file_content, 'text/plain'),
                'job_description': job_description
            }
        )
        
        headers = {'Content-Type': multipart_data.content_type}
        response = requests.post(
            'http://localhost:5000/api/analyze', 
            data=multipart_data, 
            headers=headers, 
            timeout=30
        )
        
        print(f"Analysis status: {response.status_code}")
        print(f"Analysis response: {json.dumps(response.json(), indent=2)}")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to backend. Is the server running on localhost:5000?")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_backend()
