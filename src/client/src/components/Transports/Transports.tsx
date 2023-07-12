import {
  Button,
  Card,
  FormElement,
  Grid,
  Input,
  Loading,
  Pagination,
  Row,
  Text,
} from '@nextui-org/react';
import { useLazyGetTransportsQuery } from '../../store/api/transport.api';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { TransportsWrapper } from './Transports.presets';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Select } from '../TransportForm/components/Select';
import {
  LicenceType,
  SortKeys,
  SortOrder,
  TransportType,
} from '../../types/Transport';
import { useAppSelector } from '../../store/hooks/hooks';

export const Transports = () => {
  const [page, setPage] = useState(1);
  const [maxSpeed, setMaxSpeed] = useState('');
  const { user } = useAppSelector((state) => state.user);
  const [type, setType] = useState<Set<string> | undefined>(undefined);
  const [licenceType, setLicenceType] = useState<Set<string> | undefined>();
  const [sortKey, setSortKey] = useState<Set<string> | undefined>();
  const [sortOrder, setSortOrder] = useState<Set<string> | undefined>();
  const [search, setSearch] = useState('');
  const [searchDebounce] = useDebounce(search, 500);
  const [maxSpeedDebounce] = useDebounce(maxSpeed, 500);
  const navigate = useNavigate();
  const [refetchTransports, { data, isFetching }] = useLazyGetTransportsQuery();

  const handleChange = useCallback((event: ChangeEvent<FormElement>) => {
    setSearch(event.target.value);
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, []);
  const handleSelectChange = useCallback(
    (setHandler: Dispatch<SetStateAction<Set<string> | undefined>>) =>
      (keys: Selection) => {
        setHandler(keys as unknown as Set<string>);
      },
    [],
  );
  const handleChangeMaxSpeed = useCallback(
    (event: ChangeEvent<FormElement>) => {
      setMaxSpeed(event.target.value);
    },
    [],
  );

  const handleNavigate = useCallback(
    (to: string) => () => {
      navigate(to);
    },
    [],
  );

  useEffect(() => {
    refetchTransports({});
  }, []);

  useEffect(() => {
    refetchTransports({
      page,
      limit: 6,
      search: searchDebounce,
      type: type
        ? Array.from(type as unknown as Set<string>)[0].split('#')[0]
        : undefined,
      licenceType: licenceType
        ? Array.from(licenceType as unknown as Set<string>)[0].split('#')[0]
        : undefined,
      maxSpeed: maxSpeedDebounce,
      sortKey: sortKey
        ? Array.from(sortKey as unknown as Set<string>)[0].split('#')[0]
        : undefined,
      sortOrder: sortOrder
        ? Array.from(sortOrder as unknown as Set<string>)[0].split('#')[0]
        : undefined,
    });
  }, [
    page,
    searchDebounce,
    type,
    licenceType,
    maxSpeedDebounce,
    sortKey,
    sortOrder,
  ]);

  return (
    <TransportsWrapper css={{ height: isFetching ? '65vh' : 'auto' }}>
      <div className="cards">
        <Card className="search">
          <Input placeholder="Search" onChange={handleChange} />
        </Card>
        {isFetching ? (
          <Loading size="xl" />
        ) : (
          <Grid.Container gap={2} justify="flex-start" className="items">
            {data?.data?.items && data?.data?.items?.length > 0 ? (
              data?.data?.items.map(({ _id, price, title, image }) => (
                <Grid xs={6} sm={4} key={_id}>
                  <Card
                    isPressable
                    onPress={handleNavigate(`/transports/${_id}`)}
                  >
                    <Card.Body css={{ p: 0 }}>
                      <Card.Image
                        src={image?.fileSrc ?? ''}
                        objectFit="cover"
                        width="100%"
                        height={140}
                        alt={title}
                      />
                    </Card.Body>
                    <Card.Footer css={{ justifyItems: 'flex-start' }}>
                      <Row wrap="wrap" justify="space-between" align="center">
                        <Text b>{title}</Text>
                        <Text
                          css={{
                            color: '$accents7',
                            fontWeight: '$semibold',
                            fontSize: '$sm',
                          }}
                        >
                          {price}$
                        </Text>
                      </Row>
                    </Card.Footer>
                  </Card>
                </Grid>
              ))
            ) : (
              <Text h3>No transport by your search</Text>
            )}
          </Grid.Container>
        )}
        {!isFetching && data?.data?.pagination.count !== 0 && (
          <Pagination
            total={data?.data?.pagination.totalPages}
            page={page}
            onChange={handlePageChange}
          />
        )}
      </div>
      <Card className="filters">
        {user?.role === 'ADMIN' && (
          <Button type="button" onPress={handleNavigate('/transports/create')}>
            Add new
          </Button>
        )}
        <Select
          value={type}
          setValue={handleSelectChange(setType)}
          type={TransportType}
          title="Transport type"
        />
        <Select
          value={licenceType}
          setValue={handleSelectChange(setLicenceType)}
          type={LicenceType}
          title="Licence type"
        />
        <Select
          value={sortKey}
          setValue={handleSelectChange(setSortKey)}
          type={SortKeys}
          title="Sort by"
        />
        <Select
          value={sortOrder}
          setValue={handleSelectChange(setSortOrder)}
          type={SortOrder}
          title="Sort order"
        />
        <Input
          type="number"
          label="Max speed"
          onChange={handleChangeMaxSpeed}
          value={maxSpeed}
        />
      </Card>
    </TransportsWrapper>
  );
};
