import PrimarySkillArea from '../../database/models/metadata/primarySkillArea';
import PdsaItem from '../../database/models/pdsaItem';
import SecondarySkillArea from '../../database/models/metadata/secondarySkillArea';

/**
 * Remove all references to the secondarySkillAreaId we are deleting, from the arrays in PDSAItems. Then update all PdsaItems that still have SecondarySkills but their SecondarySkillAreaSortKey is empty to use the first SecondarySkillArea they have.
 * @param {ObjectId} secondarySkillAreaId
 */
export const cleanUpSecondarySkillAreaSortKeys = async secondarySkillAreaId => {
  // and remove the id reference from the array
  await PdsaItem.updateMany(
    { secondarySkillAreas: secondarySkillAreaId },
    {
      $pullAll: {
        secondarySkillAreas: [secondarySkillAreaId]
      }
    }
  );

  // find all items that have no sort key but still contain elements in the skillArea array
  const itemsThatNeedToBeUpdatedAgain = await PdsaItem.find({
    secondarySkillAreaSortKey: '',
    $where: 'this.secondarySkillAreas.length > 0'
  });

  // for each item we found that needs to be updated, update its sort key to the next in the skill array
  itemsThatNeedToBeUpdatedAgain.forEach(async pdsaItem => {
    try {
      const newSortKey = (await SecondarySkillArea.findById(pdsaItem.secondarySkillAreas[0])).name;
      await PdsaItem.update({ _id: pdsaItem._id }, { secondarySkillAreaSortKey: newSortKey });
    } catch (e) {
      throw new Error(e);
    }
  });
};

/**
 * Remove all references to the primarySkillAreaId we are deleting, from the arrays in PDSAItems. Then update all PdsaItems that still have PrimarySkills but their PrimarySkillAreaSortKey is empty to use the first PrimarySkillArea they have.
 * @param {ObjectId} secondarySkillAreaId
 */
export const cleanUpPrimarySkillAreaSortKeys = async primarySkillAreaId => {
  // and remove the id reference from the array
  await PdsaItem.updateMany(
    { primarySkillAreas: primarySkillAreaId },
    {
      $pullAll: {
        primarySkillAreas: [primarySkillAreaId]
      }
    }
  );

  // find all items that have no sort key but still contain elements in the skillArea array
  const itemsThatNeedToBeUpdatedAgain = await PdsaItem.find({
    primarySkillAreaSortKey: '',
    $where: 'this.primarySkillAreas.length > 0'
  });

  // for each item we found that needs to be updated, update its sort key to the next in the skill array
  itemsThatNeedToBeUpdatedAgain.forEach(async pdsaItem => {
    try {
      const newSortKey = (await PrimarySkillArea.findById(pdsaItem.primarySkillAreas[0])).name;
      await PdsaItem.update({ _id: pdsaItem._id }, { primarySkillAreaSortKey: newSortKey });
    } catch (e) {
      throw new Error(e);
    }
  });
};
