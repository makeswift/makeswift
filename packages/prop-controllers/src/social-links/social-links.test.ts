import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  SocialLinksData,
  SocialLinksDescriptor,
  SocialLinksPropControllerDataV2,
  SocialLinksPropControllerDataV2Type,
  createSocialLinksPropControllerDataFromSocialLinksData,
  getSocialLinksPropControllerDataSocialLinksData,
} from './social-links'

describe('SocialLinksPropController', () => {
  describe('getSocialLinksPropControllerDataSocialLinksData', () => {
    test('returns value for SocialLinksPropControllerDataV2Type', () => {
      // Arrange
      const links: SocialLinksData = {
        links: [
          {
            id: 'id',
            payload: { url: 'https://facebook.com/mark', type: 'facebook' },
          },
        ],
        openInNewTab: false,
      }
      const data: SocialLinksPropControllerDataV2 = {
        [ControlDataTypeKey]: SocialLinksPropControllerDataV2Type,
        value: links,
      }

      // Act
      const result = getSocialLinksPropControllerDataSocialLinksData(data)

      // Assert
      expect(result).toBe(links)
    })

    test('returns value for SocialLinksPropControllerDataV1 data', () => {
      // Arrange
      const links: SocialLinksData = {
        links: [
          {
            id: 'id',
            payload: { url: 'https://facebook.com/mark', type: 'facebook' },
          },
        ],
        openInNewTab: false,
      }

      // Act
      const result = getSocialLinksPropControllerDataSocialLinksData(links)

      // Assert
      expect(result).toBe(links)
    })
  })

  describe('createSocialLinksPropControllerDataFromSocialLinksData', () => {
    test('returns SocialLinksPropControllerDataV2 when definition version is 2', () => {
      // Arrange
      const links: SocialLinksData = {
        links: [
          {
            id: 'id',
            payload: { url: 'https://facebook.com/mark', type: 'facebook' },
          },
        ],
        openInNewTab: false,
      }
      const definition: SocialLinksDescriptor = {
        type: Types.SocialLinks,
        version: 2,
        options: {},
      }

      // Act
      const result = createSocialLinksPropControllerDataFromSocialLinksData(
        links,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: SocialLinksPropControllerDataV2Type,
        value: links,
      })
    })

    test('returns SocialLinksData value when definition version is 1', () => {
      // Arrange
      const links: SocialLinksData = {
        links: [
          {
            id: 'id',
            payload: { url: 'https://facebook.com/mark', type: 'facebook' },
          },
        ],
        openInNewTab: false,
      }
      const definition: SocialLinksDescriptor = {
        type: Types.SocialLinks,
        version: 1,
        options: {},
      }

      // Act
      const result = createSocialLinksPropControllerDataFromSocialLinksData(
        links,
        definition,
      )

      // Assert
      expect(result).toBe(links)
    })

    test('returns SocialLinksData value when definition version is null', () => {
      // Arrange
      const links: SocialLinksData = {
        links: [
          {
            id: 'id',
            payload: { url: 'https://facebook.com/mark', type: 'facebook' },
          },
        ],
        openInNewTab: false,
      }
      const definition: SocialLinksDescriptor = {
        type: Types.SocialLinks,
        options: {},
      }

      // Act
      const result = createSocialLinksPropControllerDataFromSocialLinksData(
        links,
        definition,
      )

      // Assert
      expect(result).toBe(links)
    })
  })
})
