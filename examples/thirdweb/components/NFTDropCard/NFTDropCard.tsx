import {
  useClaimedNFTSupply,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useClaimNFT,
  useWalletConnect,
  useCoinbaseWallet,
  useAddress,
  useMetamask,
  useBalance,
  MediaRenderer,
  useDisconnect,
  useNetworkMismatch,
  useNetwork,
  useClaimIneligibilityReasons,
  useContract,
} from '@thirdweb-dev/react'
import {
  useToast,
  ChakraProvider,
  extendTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Grid,
  Flex,
  Divider,
  Text,
  Box,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
} from '@chakra-ui/react'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { useState, forwardRef, Ref, useMemo } from 'react'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

import { Diamond } from './icons/Diamond'
import { MetamaskLogo } from './icons/MetamaskLogo'
import { WalletConnectLogo } from './icons/WalletConnectLogo'
import { CoinbaseLogo } from './icons/CoinbaseLogo'
import { Minus } from './icons/Minus'
import { Plus } from './icons/Plus'
import { ThirdwebLogo } from './icons/ThirdwebLogo'
import { Coin } from './icons/Coin'
import { Wallet } from './icons/Wallet'
import { Duplicate } from './icons/Duplicate'
import { Unlink } from './icons/Unlink'
import { parseIneligibility } from './utils/parseIneligibility'

type Props = {
  className?: string
  contractAddress?: string
  chainId?: string
  showMedia?: boolean
  showDescription?: boolean
  totalClaimed?: 'nototal' | 'total' | 'max' | 'available'
}

const NFTDropCard = forwardRef(function NFTDropCard(
  {
    className,
    contractAddress,
    chainId,
    showMedia,
    showDescription,
    totalClaimed,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const toast = useToast()
  const { contract: nftDrop } = useContract(contractAddress, 'nft-drop')
  const address = useAddress()
  const balance = useBalance()
  const connectWithMetamask = useMetamask()
  const connectWithWalletConnect = useWalletConnect()
  const connectWithCoinbaseWallet = useCoinbaseWallet()
  const disconnectWallet = useDisconnect()
  const claimNFT = useClaimNFT(nftDrop)
  const isOnWrongNetwork = useNetworkMismatch()
  const [, switchNetwork] = useNetwork()
  // The amount the user claims
  const [quantity, setQuantity] = useState<number>(1) // default to 1
  const claimIneligibilityReasons = useClaimIneligibilityReasons(nftDrop, {
    quantity,
    walletAddress: address ?? '',
  })

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(nftDrop)

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop)
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop)

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop)

  const quantityLimitPerWallet = activeClaimCondition?.maxClaimablePerWallet

  const snapshot = activeClaimCondition?.snapshot

  const useDefault = useMemo(
    () =>
      !snapshot ||
      snapshot?.find((user) => user.address === address)?.maxClaimable === '0',
    [snapshot, address],
  )

  const maxClaimable = useDefault
    ? isNaN(Number(quantityLimitPerWallet))
      ? 1000
      : Number(quantityLimitPerWallet)
    : Number(snapshot?.find((user) => user.address === address)?.maxClaimable)

  const lowerMaxClaimable = Math.min(
    maxClaimable,
    unclaimedSupply?.toNumber() || 1000,
  )

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0

  const canClaim =
    !isSoldOut &&
    !!address &&
    !claimIneligibilityReasons.data?.length &&
    activeClaimCondition &&
    (activeClaimCondition?.availableSupply === 'unlimited' ||
      parseInt(activeClaimCondition?.availableSupply) > 0)

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || '0',
    activeClaimCondition?.currencyMetadata.decimals,
  )

  // Multiply depending on quantity
  const priceToMint = price.mul(quantity)

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return (
      <Flex justify="center" className={className} p={10}>
        <Spinner className="text-black text-opacity-50 stroke-current rotate" />
      </Flex>
    )
  }

  // Add claimed and unclaimed supply
  const claimedSubTotal = claimedSupply?.toNumber() || 0
  const unclaimedSubTotal = unclaimedSupply?.toNumber() || 0
  const totalSupply = claimedSubTotal + unclaimedSubTotal

  // Function to mint/claim an NFT
  const mint = async () => {
    if (isOnWrongNetwork && chainId) {
      if (switchNetwork) {
        switchNetwork(Number(chainId))

        toast({
          title: `Switching to correct network, please try again.`,
          status: 'warning',
        })
      }

      return
    }

    claimNFT.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          toast({
            title: `Successfully minted NFT${quantity > 1 ? 's' : ''}!`,
            status: 'success',
          })
        },
        onError: (err: any) => {
          toast({
            title: `Error minting NFT${quantity > 1 ? 's' : ''}`,
            description: err?.message || 'Something went wrong.',
            status: 'error',
          })
        },
      },
    )
  }

  return (
    <Grid className={className} ref={ref}>
      <Grid gap={8}>
        {showMedia && (
          <Flex justify="center">
            <MediaRenderer
              className="w[240px] h[240px]"
              width="240"
              height="240"
              src={contractMetadata?.image}
              alt={`${contractMetadata?.name} preview image`}
            />
          </Flex>
        )}

        <Grid gap={5}>
          <Grid gap={3}>
            <Text as="h2" fontSize="3xl" fontWeight="semibold">
              {contractMetadata?.name}
            </Text>
            {showDescription && (
              <Text as="p" fontSize="md">
                {contractMetadata?.description}
              </Text>
            )}
          </Grid>
          {totalClaimed !== 'nototal' && (
            <>
              <Divider />
              <Flex justify="center">
                {(claimedSupply &&
                  unclaimedSupply &&
                  totalClaimed == 'total') ||
                totalClaimed == 'max' ? (
                  <Text as="p" fontSize="md">
                    {/* Claimed supply so far */}
                    <Text fontWeight="bold" as="span">
                      {claimedSupply?.toNumber()}
                    </Text>
                    {/* Add unclaimed and claimed supply to get the total supply */}
                    {` / ${
                      totalClaimed == 'total'
                        ? totalSupply + 'claimed'
                        : totalClaimed == 'max'
                        ? activeClaimCondition?.maxClaimableSupply + 'claimed'
                        : '(error: supply basis undefined)'
                    }`}
                  </Text>
                ) : totalClaimed == 'available' ? (
                  <Text as="p" fontSize="md">
                    {/* Available supply left so far */}
                    {`${activeClaimCondition?.availableSupply} left`}
                  </Text>
                ) : (
                  // Show loading state if we're still loading the supply
                  <Spinner className="text-black text-opacity-50 stroke-current rotate" />
                )}
              </Flex>
            </>
          )}

          <Divider />
          <Box>
            {address ? (
              // Sold out or show the claim button
              isSoldOut ? (
                <Flex justify="center">
                  <Text as="h2" fontSize="2xl">
                    Sold Out
                  </Text>
                </Flex>
              ) : canClaim ? (
                <Flex justify="center" gap={4}>
                  <Flex gap={3} align="center">
                    <IconButton
                      size="sm"
                      variant="outline"
                      colorScheme="blackAlpha"
                      aria-label="Decrement quantity"
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus />
                    </IconButton>

                    <Text>{quantity}</Text>

                    <IconButton
                      size="sm"
                      variant="outline"
                      colorScheme="blackAlpha"
                      aria-label="Increment quantity"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= lowerMaxClaimable}
                    >
                      <Plus />
                    </IconButton>
                  </Flex>

                  <Button
                    size="lg"
                    onClick={mint}
                    disabled={claimNFT.isLoading}
                    leftIcon={<Diamond />}
                  >
                    {claimNFT.isLoading ? 'Minting...' : `Mint`}
                    <Text ml={2} fontSize="sm" opacity={0.8}>
                      {activeClaimCondition?.price.eq(0)
                        ? ' Free'
                        : activeClaimCondition?.currencyMetadata.displayValue
                        ? ` (${formatUnits(
                            priceToMint,
                            activeClaimCondition.currencyMetadata.decimals,
                          )} ${activeClaimCondition?.currencyMetadata.symbol})`
                        : ''}
                    </Text>
                  </Button>
                </Flex>
              ) : claimIneligibilityReasons.data?.length ? (
                <Flex justify="center">
                  <Text as="h2" fontSize="2xl">
                    {parseIneligibility(
                      claimIneligibilityReasons.data,
                      quantity,
                    )}
                  </Text>
                </Flex>
              ) : (
                <Flex justify="center">
                  <Text as="h2" fontSize="2xl">
                    Minting unavailable
                  </Text>
                </Flex>
              )
            ) : (
              <Grid position="relative" justifyContent="center" gap={3}>
                <Menu placement="bottom">
                  <MenuButton as={Button} size="lg">
                    Connect wallet
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<MetamaskLogo />}
                      onClick={() => {
                        connectWithMetamask()
                      }}
                    >
                      Connect MetaMask
                    </MenuItem>
                    <MenuItem
                      icon={<WalletConnectLogo />}
                      onClick={() => {
                        connectWithWalletConnect()
                      }}
                    >
                      Connect with Wallet Connect
                    </MenuItem>
                    <MenuItem
                      icon={<CoinbaseLogo />}
                      onClick={() => {
                        connectWithCoinbaseWallet()
                      }}
                    >
                      Connect with Coinbase Wallet
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Grid>
            )}
          </Box>
          <Divider />
          <Flex
            justify={balance?.data && address ? 'space-between' : 'center'}
            align="center"
          >
            <Tooltip label="Powered by thirdweb">
              <IconButton
                aria-label="thirdweb link"
                as="a"
                variant="ghost"
                colorScheme="blackAlpha"
                href="https://thirdweb.com/?utm_source=makeswift"
                target="_blank"
                rel="noreferrer"
              >
                <ThirdwebLogo />
              </IconButton>
            </Tooltip>
            {balance?.data && address && (
              <Flex gap={2}>
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      colorScheme="footer"
                      leftIcon={<Coin />}
                    >
                      {`${parseFloat(balance.data.displayValue).toFixed(3)} ${
                        balance.data.symbol
                      }`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Flex p={3} justify="space-between" align="center">
                      <Text
                        fontSize="xs"
                        textTransform="uppercase"
                        fontWeight="bold"
                      >
                        Balance
                      </Text>
                      <Text fontSize="md">
                        {`${balance.data.displayValue} ${balance.data.symbol}`}
                      </Text>
                    </Flex>
                  </PopoverContent>
                </Popover>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                    size="sm"
                    colorScheme="footer"
                    leftIcon={<Wallet />}
                  >
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<Duplicate />}
                      onClick={() =>
                        navigator.clipboard.writeText(address).then(() =>
                          toast({
                            title: 'Address copied to clipboard!',
                            status: 'success',
                            duration: 3000,
                          }),
                        )
                      }
                    >
                      Copy address
                    </MenuItem>
                    <MenuItem icon={<Unlink />} onClick={disconnectWallet}>
                      Disconnect wallet
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            )}
          </Flex>
        </Grid>
      </Grid>
    </Grid>
  )
})

type ProviderProps = Props & {
  buttonBgColor?: string
  buttonTextColor?: string
  chainId?: string
  clientId?: string
}

const NFTDropCardProvider = forwardRef(function NFTDropCardProvider(
  {
    chainId,
    clientId,
    className,
    contractAddress,
    buttonBgColor,
    buttonTextColor,
    showMedia,
    showDescription,
    totalClaimed,
  }: ProviderProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <ThirdwebProvider activeChain={Number(chainId)} clientId={clientId}>
      <ChakraProvider
        theme={extendTheme({
          fonts: {
            heading: `'Barlow', system-ui`,
            body: `'Barlow', system-ui`,
          },
          components: {
            Divider: {
              baseStyle: { borderColor: 'rgba(0,0,0,0.2)' },
            },
            Menu: {
              baseStyle: {
                list: {
                  padding: 1,
                },
                item: {
                  borderRadius: 4,
                  px: 3,
                },
              },
            },
            Button: {
              baseStyle: {
                borderRadius: 500,
              },
              variants: {
                solid: {
                  bg: buttonBgColor,
                  color: buttonTextColor,
                  _hover: {
                    bg: buttonBgColor,
                    color: buttonTextColor,
                    _disabled: {
                      bg: buttonBgColor,
                      color: buttonTextColor,
                    },
                  },
                  _active: {
                    bg: buttonBgColor,
                    color: buttonTextColor,
                  },
                },
                outline: (props: StyleFunctionProps) =>
                  props.colorScheme === 'footer' && {
                    borderColor: 'rgba(0,0,0,0.15)',
                    color: 'rgba(0,0,0,0.5)',
                    _hover: { bg: 'rgba(0,0,0,0.05)' },
                    _active: { bg: 'rgba(0,0,0,0.08)' },
                  },
              },
            },
            Badge: {
              variants: {
                subtle: {
                  bg: '#fff',
                  color: '#000',
                  opacity: 0.8,
                },
              },
            },
          },
        })}
      >
        <NFTDropCard
          ref={ref}
          className={className}
          contractAddress={contractAddress}
          chainId={chainId}
          showMedia={showMedia}
          showDescription={showDescription}
          totalClaimed={totalClaimed}
        />
      </ChakraProvider>
    </ThirdwebProvider>
  )
})

export default NFTDropCardProvider
