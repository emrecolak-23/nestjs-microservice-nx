# Jobber

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/nest?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/FG67DsmqYe)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve auth
```

To create a production bundle:

```sh
npx nx build auth
```

To see all available targets to run for a project, run:

```sh
npx nx show project auth
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/nest:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

---

## Useful links

Learn more:

- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

---

## Helm Chart Deployment

### Quick notes (English)

These are the quick steps I used when testing the chart — you can follow them as a short checklist:

- Create a Helm chart:

  - `helm create jobber`

- Edit templates:

  - Update the files under `charts/jobber/templates/` (for example create or edit `deployment.yaml`, `service.yaml`, etc.) to match your application manifests.

- Install the chart and create the namespace:

  - `helm install jobber . -n jobber --create-namespace`

- Verify namespace and pods:
  - `kubectl get namespaces | grep jobber`
  - `kubectl get po -n jobber`
  - Example: describe a specific pod to inspect status and events:
    - `kubectl describe po jobs-678848c49-sdxtc -n jobber`

These commands are a minimal workflow to deploy the chart to a local or remote Kubernetes cluster.

---

### Pulling images from AWS ECR into Minikube (local cluster)

If your images are stored in AWS ECR and you want to pull them into a local Minikube Docker environment, you can run the following example (replace placeholders):

```sh
# Point Docker CLI at Minikube's Docker daemon
eval $(minikube docker-env)

# Login to ECR (replace <AWS_REGION> and <AWS_ACCOUNT_ID>)
aws ecr get-login-password --region <AWS_REGION> \
	| docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

# Pull the image from your ECR repository
docker pull <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/jobber/jobs:latest

# Install/upgrade the Helm chart using the pulled image (set imagePullPolicy=Never so Minikube uses local image)
helm upgrade jobber . -n jobber --install --create-namespace \
	--set global.imagePullPolicy=Never \
	--set jobs.enabled=true \
	--set auth.enabled=false \
	--set executor.enabled=false

# Check pods for the 'jobs' app
kubectl get pods -n jobber -l app=jobs
```

**Notes:**

- Ensure `minikube` is running before running the commands.
- You must have AWS credentials configured locally (for example `aws configure`, or environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).
- Replace `<AWS_ACCOUNT_ID>` and `<AWS_REGION>` with your AWS account ID and region (for example `eu-north-1`).
- Using `--set global.imagePullPolicy=Never` makes Kubernetes use the image already present in the Minikube Docker daemon.

---

### Adding PostgreSQL and Pulsar Dependencies

After adding PostgreSQL and Pulsar as Helm chart dependencies:

1. **Update Helm dependencies:**

```sh
   helm dependency update
```

2. **If you encounter "postgresql not found" error, create the PostgreSQL namespace:**

```sh
   kubectl create namespace postgresql
```

3. **Upgrade the Helm release:**

```sh
   helm upgrade jobber . -n jobber
```

4. **Verify that PostgreSQL pods are created:**

```sh
   kubectl get po -n postgresql
```

5. **Verify that Pulsar pods are created:**

```sh
   kubectl get po -n pulsar
```

**Note:** Make sure the namespace configurations in your `Chart.yaml` or `values.yaml` match the namespaces you create. If dependencies are installed in different namespaces, verify connectivity between services.

---

### Scaling Deployments

To scale the number of pod replicas for a deployment:

```sh
# Scale executor deployment to 5 replicas
kubectl scale deployment executor --replicas 5 -n jobber

# Verify the scaling
kubectl get po -n jobber -l app=executor
```

This command is useful when you need to handle more load or want to test horizontal scaling of your services.

---

### Accessing Pulsar Pods and Monitoring Backlogs

To access a Pulsar pod and monitor message backlogs:

```sh
# Enter the Pulsar broker pod
kubectl exec -it jobber-pulsar-broker-0 -n pulsar -- sh

# Once inside the pod, you can use Pulsar admin commands to monitor backlogs:
# List topics
bin/pulsar-admin topics list public/default

# Check topic stats (includes backlog information)
bin/pulsar-admin topics stats persistent://public/default/Fibonacci

# List subscriptions for a topic
bin/pulsar-admin topics subscriptions persistent://public/default/Fibonacci

# Check subscription stats (backlog size)
bin/pulsar-admin topics stats-internal persistent://public/default/Fibonacci

# Clear all backlogs in the public/default namespace
bin/pulsar-admin namespaces clear-backlog public/default

# Unsubscribe/remove a subscription from all topics in the namespace
bin/pulsar-admin namespaces unsubscribe public/default --sub jobber
```

Replace `<topic-name>` with your actual Pulsar topic name. The backlog information shows how many unacknowledged messages are waiting to be consumed. Use the `clear-backlog` command carefully as it removes all unacknowledged messages from all topics in the namespace. The `unsubscribe` command removes the specified subscription from all topics in the namespace.

---

## Database Migrations

### Drizzle ORM (Products App)

The `products` app uses Drizzle ORM for database management. To generate migrations after modifying your schema:

```sh
# Generate migration files based on schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit migrate

# Push migrations to the database (alternative to migrate)
npx drizzle-kit push

# Open Drizzle Studio to view/edit data
npx drizzle-kit studio
```

Make sure your database connection is properly configured in `apps/products/drizzle.config.ts` before running these commands.
