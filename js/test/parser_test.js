import {assertEqual, assertEqualArray} from "../tools/test_tools.js"
import {buildAliasMap, searchAdditionalExamples} from "../src/parser.js";

import {parseExample} from "../src/parser.js";
export function runAllTests() {
  checkParseExample();
  checkParseExample2();
  checkBuildAliasMap();

  checkSearchAdditionalExamples()
}

function checkParseExample() {
  let actual = parseExample("anel mew fach-antü",
                            "amenazar (inst) este-dia")
  let expected = ["anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

  assertEqualArray(actual, expected)
}

function checkParseExample2() {
  let actual = parseExample("apon anel mew fach-antü",
                            "estar.lleno amenazar (inst) este-dia")
  let expected = ["apon*estar lleno", " ", "anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

  assertEqualArray(actual, expected)
}

function checkBuildAliasMap() {

  let data = {}
  data["mew|inst"] = {}
  data["mew|inst"]["variations"] = ["mu", "mo"]
  data["le|adv"] = {}
  data["le|adv"]["variations"] = ["küle"]
  data["a|conj"] = {}
  data["a|conj"]["variations"] = ["ya"]
  data["b|conj"] = {}
  data["b|conj"]["variations"] = []

  let aliasMap = buildAliasMap(data)

  assertEqual(aliasMap.get("mu|inst"), "mew|inst")
  assertEqual(aliasMap.get("mew|inst"), "mew|inst")
  assertEqual(aliasMap.get("mo|inst"), "mew|inst")

  assertEqual(aliasMap.get("le|adv"), "le|adv")
  assertEqual(aliasMap.get("küle|adv"), "le|adv")

  assertEqual(aliasMap.get("a|conj"), "a|conj")
  assertEqual(aliasMap.get("ya|conj"), "a|conj")

  assertEqual(aliasMap.get("b|conj"), "b|conj")
}

function checkSearchAdditionalExamples() {
  let data = {}
  data["mew|inst"] = {}
  data["mew|inst"]["variations"] = ["mu", "mo"]
  data["mew|inst"]["content"] = []

  let mewContent1 = {}
  mewContent1["examples"] = [["", "",""],["","",""]]
  data["mew|inst"]["content"].push(mewContent1)

  data["le|adv"] = {}
  data["le|adv"]["variations"] = ["küle"]

  let leContent1 = {}
  leContent1["examples"] = [["", "",""]]

  let leContent2 = {}
  leContent2["examples"] = [["mew ko-le", "(inst) agua-(adv)","esp1"]]

  data["le|adv"]["content"] = []
  data["le|adv"]["content"].push(leContent1)
  data["le|adv"]["content"].push(leContent2)

  data["a|conj"] = {}
  data["a|conj"]["variations"] = ["ya"]

  let aContent1 = {}
  aContent1["examples"] = [["", "",""]]

  let aContent2 = {}
  aContent2["examples"] = [["b a piru","(conj) (conj) gusano","esp2"]]

  data["a|conj"]["content"] = []
  data["a|conj"]["content"].push(aContent1)
  data["a|conj"]["content"].push(aContent2)

  data["b|conj"] = {}
  data["b|conj"]["variations"] = []

  let bContent1 = {}
  bContent1["examples"] = [["", "",""]]

  let bContent2 = {}
  bContent2["examples"] = [["fey-mu","el-(inst)","esp3"]]

  data["b|conj"]["content"] = []
  data["b|conj"]["content"].push(bContent1)
  data["b|conj"]["content"].push(bContent2)

  let aliasMap = buildAliasMap(data)
  let examples = searchAdditionalExamples("mu|inst", data, aliasMap)

  assertEqualArray(["mew|inst", " ", "ko*agua", "le|adv"], examples[0][0])
  assertEqualArray("esp1", examples[0][1])

  assertEqualArray(["fey*el", "mu|inst"], examples[1][0])
  assertEqualArray("esp3", examples[1][1])

  let examples2 = searchAdditionalExamples("b|conj", data, aliasMap)
  assertEqualArray(["b|conj", " ", "a|conj", " ", "piru*gusano"], examples2[0][0])
  assertEqualArray("esp2", examples2[0][1])
}
