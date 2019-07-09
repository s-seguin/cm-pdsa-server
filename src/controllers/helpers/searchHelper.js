import SecondarySkillArea from '../../database/models/metadata/secondarySkillArea';
import PrimarySkillArea from '../../database/models/metadata/primarySkillArea';

/**
 * Return an array of all the ids where SecondarySkillArea names (via text index) match the searchQuery
 *
 * @param {String} searchQuery the query we are comparing our SecondarySkillAreas names too
 */
export const getIdsOfSecondarySkillsMatchingSearch = async searchQuery => {
  const matchingSecondarySkillIds = await SecondarySkillArea.find({
    $text: { $search: searchQuery }
  }).select('_id');

  return matchingSecondarySkillIds.map(o => o._id);
};

/**
 * Return an array of all the ids where PrimarySkillArea names (via text index) match the searchQuery
 *
 * @param {String} searchQuery the query we are comparing our PrimarySkillArea names too
 */
export const getIdsOfPrimarySkillsMatchingSearch = async searchQuery => {
  const matchingPrimarySkillIds = await PrimarySkillArea.find({
    $text: { $search: searchQuery }
  }).select('_id');

  return matchingPrimarySkillIds.map(o => o._id);
};
