const MagicNumFactory = artifacts.require("./levels/MagicNumFactory.sol");
const MagicNum = artifacts.require("./levels/MagicNum.sol");
const MagicNumSolver = artifacts.require("./attacks/MagicNumSolver.sol");
const MagicNumBadSolver = artifacts.require("./attacks/MagicNumBadSolver.sol");

const Ethernaut = artifacts.require("./Ethernaut.sol");

import * as utils from "../utils/TestUtils";
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";
import toPromise from "zeppelin-solidity/test/helpers/toPromise";

contract("MagicNum", function(accounts) {

  let ethernaut
  let level
  let instance
  let player = accounts[0]

  before(async function() {
    ethernaut = await Ethernaut.new();
    level = await MagicNumFactory.new()
    await ethernaut.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      ethernaut, level.address, player, MagicNum,
      {from: player}
    )
  });

  describe("instance", function() {

    it("should not be solvable with a contract created regularly", async function() {

      const badSolver = await MagicNumBadSolver.new();

      await instance.setSolver(badSolver.address);

      const completed = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );

      assert.isFalse(completed);
    });

    it("should be solvable with a manually constructed contract", async function() {

      const solver = await MagicNumSolver.new();

      await instance.setSolver(solver.address);

      const completed = await utils.submitLevelInstance(
        ethernaut,
        level.address,
        instance.address,
        player
      );

      assert.isTrue(completed);
    });

    // it("should unlock with a non-zero first byte", async function() {
    //   let _name = "0x0000000000000000000000000000000000000000000000000000000000000001"
    //   let _address = "0x123"

    //   // Unlock.
    //   await instance.register(_name, _address);
    //   assert.equal(await instance.unlocked(), true);

    //   // Factory check (should pass)
    //   const completed = await utils.submitLevelInstance(
    //     ethernaut,
    //     level.address,
    //     instance.address,
    //     player
    //   );
    //   assert.equal(completed, true);
    // });

  });

});
