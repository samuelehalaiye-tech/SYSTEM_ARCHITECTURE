import urllib.request
import urllib.error
import json

def fetch_all_yola_locations():
    """
    Fetches comprehensive POI data for Yola using Overpass API.
    Utilizes Python's built-in urllib to avoid external dependencies.
    """
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    overpass_query = """
    [out:json][timeout:50];
    (
      node["amenity"](9.18, 12.38, 9.32, 12.50);
      node["shop"](9.18, 12.38, 9.32, 12.50);
      node["office"](9.18, 12.38, 9.32, 12.50);
      node["tourism"](9.18, 12.38, 9.32, 12.50);
      node["leisure"](9.18, 12.38, 9.32, 12.50);
    );
    out body;
    """.encode('utf-8')
    
    headers = {
        "User-Agent": "Reikeke-Spatial-Data-Seeder/1.0",
        "Accept": "*/*"
    }
    
    print("Initiating data extraction for Yola...")
    
    req = urllib.request.Request(overpass_url, data=overpass_query, headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            # Decode and parse the JSON response
            data = json.loads(response.read().decode('utf-8'))
            locations = []
            
            for element in data.get('elements', []):
                tags = element.get('tags', {})
                locations.append({
                    "name": tags.get("name", "Unnamed Location"),
                    "category": tags.get("amenity") or tags.get("shop") or tags.get("office") or tags.get("tourism") or "Unknown",
                    "latitude": element.get("lat"),
                    "longitude": element.get("lon")
                })
                
            file_name = "yola_comprehensive_locations.json"
            with open(file_name, "w", encoding="utf-8") as f:
                json.dump(locations, f, indent=4)
                
            print(f"Successfully extracted {len(locations)} locations to {file_name}")
            
    except urllib.error.URLError as e:
        print(f"HTTP Request failed: {e}")

if __name__ == "__main__":
    fetch_all_yola_locations()