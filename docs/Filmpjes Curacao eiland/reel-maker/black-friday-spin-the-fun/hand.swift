import Foundation
import Vision
import CoreImage
// Gebruik: hand <map met PNG's>  -> per frame JSON: handen met pols, middelvinger-top, wijsvinger-top (pixels, y van boven)
let dir = URL(fileURLWithPath: CommandLine.arguments[1])
let files = try FileManager.default.contentsOfDirectory(atPath: dir.path).filter { $0.hasSuffix(".png") }.sorted()
var out: [[String: Any]] = []
for f in files {
  autoreleasepool {
    guard let img = CIImage(contentsOf: dir.appendingPathComponent(f)) else { return }
    let W = img.extent.width, H = img.extent.height
    let req = VNDetectHumanHandPoseRequest(); req.maximumHandCount = 2
    try? VNImageRequestHandler(ciImage: img, options: [:]).perform([req])
    var hands: [[String: Any]] = []
    for obs in req.results ?? [] {
      var h: [String: Any] = [:]
      for (naam, j) in [("pols", VNHumanHandPoseObservation.JointName.wrist), ("midden", .middleTip), ("wijs", .indexTip), ("knokkel", .middleMCP)] {
        if let p = try? obs.recognizedPoint(j), p.confidence > 0.3 { h[naam] = [Double(p.location.x * W), Double((1 - p.location.y) * H), Double(p.confidence)] }
      }
      hands.append(h)
    }
    out.append(["f": f, "handen": hands])
  }
}
let data = try JSONSerialization.data(withJSONObject: out)
FileManager.default.createFile(atPath: CommandLine.arguments[2], contents: data)
print("klaar", files.count)
