# GET THE LOCATION OF AN IMAGE -> YOU CAN USE THIS TO FIND SOMEONE

```javascript
  function handleFileSelect(event) {
  const fileInput = event.target;
  const selectedFile = fileInput.files[0];

  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const exifData = getExifData(e.target.result);

      if (exifData && exifData.GPSLatitude && exifData.GPSLongitude) {
        const latitude = exifData.GPSLatitude;
        const longitude = exifData.GPSLongitude;

        console.log('Latitude: ', convertDMSToDD(latitude));
        console.log('Longitude: ', convertDMSToDD(longitude));
      } else {
        console.log('No GPS coordinates found in the EXIF data.');
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  }
}

function getExifData(buffer) {
  const view = new DataView(buffer);

  if (view.getUint16(0, false) != 0xFFD8) {
    console.error('Not a valid JPEG file'); // Check if it's a valid JPEG file
    return;
  }

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (view.getUint16(offset + 2, false) <= 8) return; // No EXIF data

    const marker = view.getUint16(offset, false);
    offset += 2;

    if (marker == 0xFFE1) {
      if (view.getUint32((offset += 2), false) != 0x45786966) {
        console.error('Invalid marker');
        return;
      }

      const little = view.getUint16((offset += 6), false) == 0x4949;

      offset += view.getUint32(offset + 4, little);

      const tags = view.getUint16(offset, little);

      offset += 2;

      for (let i = 0; i < tags; i++) {
        if (view.getUint16(offset + i * 12, little) == 0x8825) {
          return readGPSInfo(
            view,
            offset + view.getUint32(offset + i * 12 + 8, little),
            little
          );
        }
      }
    } else if ((marker & 0xFF00) != 0xFF00) {
      break;
    } else {
      offset += view.getUint16(offset, false);
    }
  }
}

function readGPSInfo(view, offset, little) {
  const count = view.getUint16(offset + 2, little);
  offset += 4;

  const gpsInfo = {};

  for (let i = 0; i < count; i++) {
    const tag = view.getUint16(offset + i * 12, little);
    const fieldType = view.getUint16(offset + i * 12 + 2, little);

    if (tag == 0x0002 || tag == 0x0004) {
      gpsInfo['GPSLatitude'] = view.getUint32(offset + i * 12 + 8, little);
    } else if (tag == 0x0001 || tag == 0x0003) {
      gpsInfo['GPSLongitude'] = view.getUint32(offset + i * 12 + 8, little);
    }
  }

  return gpsInfo;
}

function convertDMSToDD(dms) {
  return dms[0] + dms[1] / 60 + dms[2] / 3600;
}

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

```


## WRITING A SECRETE MESSAGE IN AN IMAGE JUST FOR FUN. I CAN ALSO HELP YOU EMBED AN ANONYMOUS CODE TO RUN WHEN SOMEONE OPENS THE IMAGE OR FILE LIKE, KEEPING TRACK OF HOW MANY PEOPLE OPPENED YOUR APPLICATION / IMAGE / AUDIO / ANY... YOU CAN DO ANYTHING BUT THE SIMPLE EXAMPLE IS SENDING YOUR SERVER A MESSAGE SAYING THIS PERSON / DEVICE OPENNED YOUR IMAGE / FILE....


### `BELOW IS THE CODE TO EMBED A SECRET MESAGE IN A FILE`



```javascript
// Encode a message into an image
function encodeMessage(imageURL, message) {
  // Create an image element
  var img = new Image();
  
  // Set the crossOrigin attribute to anonymous to avoid security issues
  img.crossOrigin = "Anonymous";
  
  // Set the onload event handler
  img.onload = function() {
    // Create a canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Get the 2D drawing context
    var ctx = canvas.getContext("2d");
    
    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Encode the message into the image
    encodeText(ctx, message);

    // Convert the canvas back to an image URL
    var encodedImageURL = canvas.toDataURL();
    
    // Do something with the encoded image URL (e.g., display or save)
    console.log("Encoded Image URL:", encodedImageURL);
  };
  
  // Set the image source
  img.src = imageURL;
}

// Function to encode text into an image
function encodeText(context, text) {
  // Convert the text to binary
  var binaryText = textToBinary(text);
  
  // Get the image data from the context
  var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  
  // Modify the image data to include the binary message
  for (var i = 0; i < binaryText.length; i++) {
    // Modify the least significant bit of each color channel
    imageData.data[i * 4 + 3] = (imageData.data[i * 4 + 3] & 0xFE) | (binaryText[i] == '1' ? 1 : 0);
  }
  
  // Put the modified image data back onto the context
  context.putImageData(imageData, 0, 0);
}

// Function to convert text to binary
function textToBinary(text) {
  var binaryText = '';
  for (var i = 0; i < text.length; i++) {
    // Convert each character to binary and pad to 8 bits
    binaryText += text[i].charCodeAt(0).toString(2).padStart(8, '0');
  }
  return binaryText;
}

// Example usage
var imageUrl = 'path/to/your/image.jpg';
var secretMessage = 'This is a secret message!';
encodeMessage(imageUrl, secretMessage);

```

# `FOLLOW ME`
* ### [FACEBOOK](https://www.facebook.com/medzy.amara.1)
* ### [TIKTOK](https://www.tiktok.com/@medzyemsamara)