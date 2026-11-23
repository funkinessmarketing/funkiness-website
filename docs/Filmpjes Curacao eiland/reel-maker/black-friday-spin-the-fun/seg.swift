import Foundation
import Vision
import CoreImage
import AppKit
// Gebruik: seg <invoer-map> <uitvoer-map>  (PNG's in, maskers als PNG uit)
let args = CommandLine.arguments
let inDir = URL(fileURLWithPath: args[1]), outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
let files = try FileManager.default.contentsOfDirectory(atPath: inDir.path).filter { $0.hasSuffix(".png") }.sorted()
let ctx = CIContext()
for f in files {
  autoreleasepool {
    guard let img = CIImage(contentsOf: inDir.appendingPathComponent(f)) else { return }
    let req = VNGeneratePersonSegmentationRequest()
    req.qualityLevel = .accurate
    req.outputPixelFormat = kCVPixelFormatType_OneComponent8
    let h = VNImageRequestHandler(ciImage: img, options: [:])
    try? h.perform([req])
    guard let buf = req.results?.first?.pixelBuffer else { return }
    var m = CIImage(cvPixelBuffer: buf)
    m = m.transformed(by: CGAffineTransform(scaleX: img.extent.width / m.extent.width, y: img.extent.height / m.extent.height))
    if let cg = ctx.createCGImage(m, from: img.extent) {
      let rep = NSBitmapImageRep(cgImage: cg)
      try? rep.representation(using: .png, properties: [:])?.write(to: outDir.appendingPathComponent(f))
    }
  }
}
print("klaar", files.count)
