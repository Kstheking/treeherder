import React from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import { getTitle } from '../helpers';
import { getJobsUrl } from '../../helpers/url';

import Assignee from './Assignee';

const AlertHeader = ({
  alertSummary,
  repoModel,
  issueTrackers,
  user,
  updateAssignee,
}) => {
  const getIssueTrackerUrl = () => {
    const { issueTrackerUrl } = issueTrackers.find(
      tracker => tracker.id === alertSummary.issue_tracker,
    );
    return issueTrackerUrl + alertSummary.bug_number;
  };
  const bugNumber = alertSummary.bug_number
    ? `Bug ${alertSummary.bug_number}`
    : '';

  return (
    <Container>
      <Row>
        <a
          className="text-dark font-weight-bold align-middle"
          href={`#/alerts?id=${alertSummary.id}`}
          id={`alert summary ${alertSummary.id.toString()} title`}
          data-testid={`alert summary ${alertSummary.id.toString()} title`}
        >
          Alert #{alertSummary.id} - {alertSummary.repository} -{' '}
          {getTitle(alertSummary)}{' '}
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="icon-superscript"
          />
        </a>
      </Row>
      <Row className="font-weight-normal">
        <Col className="p-0" xs="auto">{`${moment(
          alertSummary.push_timestamp * 1000,
        ).format('ddd MMM D, HH:mm:ss')} ·`}</Col>
        <Col className="p-0" xs="auto">
          <UncontrolledDropdown tag="span">
            <DropdownToggle
              className="btn-link text-info p-0"
              color="transparent"
              caret
            >
              {alertSummary.revision.slice(0, 12)}
            </DropdownToggle>
            <DropdownMenu>
              <a
                className="text-dark"
                href={getJobsUrl({
                  repo: alertSummary.repository,
                  fromchange: alertSummary.prev_push_revision,
                  tochange: alertSummary.revision,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DropdownItem tag="a">Jobs</DropdownItem>
              </a>
              <a
                className="text-dark"
                href={repoModel.getPushLogRangeHref({
                  fromchange: alertSummary.prev_push_revision,
                  tochange: alertSummary.revision,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DropdownItem tag="a">Pushlog</DropdownItem>
              </a>
            </DropdownMenu>
          </UncontrolledDropdown>
          <span>·</span>
        </Col>
        {bugNumber && (
          <Col className="p-0" xs="auto">
            {alertSummary.issue_tracker && issueTrackers.length > 0 ? (
              <a
                className="text-info align-middle"
                href={getIssueTrackerUrl(alertSummary)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {bugNumber}
              </a>
            ) : (
              { bugNumber }
            )}
            <span>·</span>
          </Col>
        )}
        <Col className="p-0" xs="auto">
          <Assignee
            assigneeUsername={alertSummary.assignee_username}
            updateAssignee={updateAssignee}
            user={user}
          />
        </Col>
      </Row>
    </Container>
  );
};

AlertHeader.propTypes = {
  alertSummary: PropTypes.shape({}).isRequired,
  repoModel: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  issueTrackers: PropTypes.arrayOf(PropTypes.shape({})),
};

AlertHeader.defaultProps = {
  issueTrackers: [],
};

export default AlertHeader;
