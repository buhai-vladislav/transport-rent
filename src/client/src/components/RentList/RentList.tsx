import { Card, Grid, Pagination, Text } from '@nextui-org/react';
import { useLazyGetRentListQuery } from '../../store/api/rent.api';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RentListWrapper } from './RentList.presets';

export const RentList = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [getRentList, { data, isLoading, error }] = useLazyGetRentListQuery();

  const handleNavigate = useCallback(
    (to: string) => () => {
      navigate(to);
    },
    [],
  );

  useEffect(() => {
    getRentList({ page, limit: 6 });
  }, []);

  useEffect(() => {
    getRentList({ page, limit: 6 });
  }, [page]);

  return (
    <RentListWrapper>
      <Grid.Container gap={2} justify="center" className="items">
        {data?.data?.items && data?.data?.items?.length > 0 ? (
          data?.data?.items.map(
            ({ _id, fromDate, stoppedAt, toDate, transport }) => (
              <Grid xs={6} sm={4} key={_id}>
                <Card
                  isPressable
                  onPress={handleNavigate(`/transports/${transport._id}`)}
                >
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      src={transport.image?.fileSrc ?? ''}
                      objectFit="cover"
                      width="100%"
                      height={140}
                      alt={transport.title}
                    />
                  </Card.Body>
                  <Card.Footer css={{ justifyItems: 'flex-start' }}>
                    <div className="info-block">
                      <Text>
                        <Text b>Name:</Text> {transport.title}
                      </Text>
                      <Text>
                        <Text b>Price:</Text> {transport.price}$(per/h)
                      </Text>
                      <Text>
                        <Text b>Rented at:</Text>{' '}
                        {new Date(fromDate).toDateString()}
                      </Text>
                      <Text>
                        <Text b>Stopped at: </Text>
                        {stoppedAt
                          ? new Date(stoppedAt).toDateString()
                          : 'In rent'}
                      </Text>
                    </div>
                  </Card.Footer>
                </Card>
              </Grid>
            ),
          )
        ) : (
          <Text h3>No rented transports...</Text>
        )}
      </Grid.Container>
      {data?.data?.pagination && data?.data?.pagination?.totalPages > 0 && (
        <Pagination
          total={data?.data?.pagination.totalPages}
          page={page}
          onChange={setPage}
        />
      )}
    </RentListWrapper>
  );
};
